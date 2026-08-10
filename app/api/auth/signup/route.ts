import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function isConfigured() {
  return Boolean(supabaseUrl && anonKey && serviceRoleKey);
}

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "اعدادات Supabase غير مكتملة" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const password = String(body?.password ?? "");
  const fullName = String(body?.full_name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "البريد الالكتروني غير صحيح" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "كلمة المرور يجب الا تقل عن 8 احرف" }, { status: 400 });
  }
  if (!fullName || !phone) {
    return NextResponse.json({ error: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
  }

  const duplicateCheck = await fetch(
    `${supabaseUrl}/rest/v1/profiles?select=id&email=ilike.${encodeURIComponent(email)}&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    },
  );

  if (!duplicateCheck.ok) {
    return NextResponse.json({ error: "تعذر التحقق من الحساب" }, { status: 502 });
  }

  const existing = await duplicateCheck.json();
  if (Array.isArray(existing) && existing.length > 0) {
    return NextResponse.json(
      { error: "يوجد حساب مسجل بهذا البريد. استخدم تسجيل الدخول او استعادة كلمة المرور" },
      { status: 409 },
    );
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName, phone },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = String(data?.msg ?? data?.message ?? "فشل انشاء الحساب");
    const duplicate = /already|registered|exists/i.test(message);
    return NextResponse.json(
      { error: duplicate ? "يوجد حساب مسجل بهذا البريد" : message },
      { status: duplicate ? 409 : response.status },
    );
  }

  return NextResponse.json({ session: data.access_token ? data : null });
}
