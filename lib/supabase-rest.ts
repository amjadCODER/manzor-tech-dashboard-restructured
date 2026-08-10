export type Session = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email?: string };
};

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseUrl = rawUrl.trim().replace(/\/$/, "").replace(/\/(rest|auth)\/v1.*$/i, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SESSION_KEY = "manzor_session";

type AuthSessionResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user: Session["user"];
};

function assertConfigured() {
  if (!supabaseUrl || !anonKey) {
    throw new Error("اعدادات Supabase غير مضافة");
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)) {
    throw new Error("رابط Supabase غير صحيح. استخدم Project URL فقط");
  }
}

function authHeaders(token?: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token ?? anonKey}`,
    "Content-Type": "application/json",
  };
}

function persistSession(data: AuthSessionResponse): Session {
  const session: Session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    user: data.user,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function refreshSession(): Promise<Session | null> {
  assertConfigured();
  const session = getSession();
  if (!session?.refresh_token) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!response.ok) {
    signOut();
    return null;
  }

  return persistSession(await response.json());
}

async function requireSession(): Promise<Session> {
  const session = getSession();
  if (!session) throw new Error("غير مسجل دخول");

  const expiresSoon = session.expires_at <= Math.floor(Date.now() / 1000) + 60;
  if (!expiresSoon) return session;

  const refreshed = await refreshSession();
  if (!refreshed) throw new Error("انتهت جلسة الدخول");
  return refreshed;
}

export async function getAccessToken() {
  return (await requireSession()).access_token;
}

export async function signUp(
  email: string,
  password: string,
  meta: { full_name: string; phone: string },
) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, ...meta }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "فشل انشاء الحساب");

  if (data.session?.access_token) {
    return persistSession(data.session);
  }

  return null;
}

export async function signIn(email: string, password: string) {
  assertConfigured();
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description ?? data.msg ?? "بيانات الدخول غير صحيحة");
  }

  return persistSession(data);
}

export async function requestPasswordReset(email: string) {
  assertConfigured();
  const redirectTo = `${window.location.origin}/reset-password`;
  const response = await fetch(`${supabaseUrl}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.msg ?? data.message ?? "تعذر ارسال رابط الاستعادة");
  }
}

export async function updateRecoveredPassword(accessToken: string, password: string) {
  assertConfigured();
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.msg ?? data.message ?? "تعذر تحديث كلمة المرور");
  }
}

export async function select<T = unknown>(table: string, query = "") {
  assertConfigured();
  const session = await requireSession();
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { ...authHeaders(session.access_token), Prefer: "return=representation" },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "تعذر جلب البيانات");
  return data as T;
}

export async function insert<T = unknown>(table: string, payload: unknown) {
  assertConfigured();
  const session = await requireSession();
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...authHeaders(session.access_token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "تعذر حفظ البيانات");
  return data as T;
}

export async function update(table: string, query: string, payload: unknown) {
  assertConfigured();
  const session = await requireSession();
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: { ...authHeaders(session.access_token), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "تعذر التحديث");
  return data;
}
