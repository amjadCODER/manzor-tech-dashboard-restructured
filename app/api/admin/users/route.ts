import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const serviceHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !supabaseUrl || !anonKey || !serviceRoleKey) return null;

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!userResponse.ok) return null;

  const user = await userResponse.json();
  const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=role,status&id=eq.${user.id}`, {
    headers: serviceHeaders,
    cache: "no-store",
  });
  if (!profileResponse.ok) return null;

  const profiles = await profileResponse.json();
  return profiles[0]?.role === "admin" && profiles[0]?.status === "active" ? user : null;
}

async function writeAuditLog(actorId: string, targetId: string, action: string, details: Record<string, unknown>) {
  await fetch(`${supabaseUrl}/rest/v1/activity_logs`, {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({ actor_id: actorId, target_id: targetId, action, details }),
  });
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*&order=created_at.desc`, {
    headers: serviceHeaders,
    cache: "no-store",
  });

  const data = await response.json().catch(() => []);
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(request: NextRequest) {
  const actor = await verifyAdmin(request);
  if (!actor) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? "");
  const role = String(body?.role ?? "");
  const status = String(body?.status ?? "");
  const permissions = Array.isArray(body?.permissions) ? body.permissions.filter((value: unknown) => typeof value === "string") : [];
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!id || !["customer", "employee", "admin"].includes(role) || !["active", "disabled"].includes(status)) {
    return NextResponse.json({ error: "بيانات المستخدم غير صحيحة" }, { status: 400 });
  }
  if (newPassword && newPassword.length < 8) {
    return NextResponse.json({ error: "كلمة المرور الجديدة يجب الا تقل عن 8 احرف" }, { status: 400 });
  }

  const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ role, status }),
  });
  if (!profileResponse.ok) {
    return NextResponse.json({ error: "تعذر تحديث بيانات المستخدم" }, { status: 400 });
  }

  const deletePermissions = await fetch(`${supabaseUrl}/rest/v1/user_permissions?user_id=eq.${id}`, {
    method: "DELETE",
    headers: serviceHeaders,
  });
  if (!deletePermissions.ok) {
    return NextResponse.json({ error: "تعذر تحديث الصلاحيات" }, { status: 400 });
  }

  if (permissions.length > 0) {
    const permissionsResponse = await fetch(`${supabaseUrl}/rest/v1/user_permissions`, {
      method: "POST",
      headers: serviceHeaders,
      body: JSON.stringify(permissions.map((appKey: string) => ({ user_id: id, app_key: appKey }))),
    });
    if (!permissionsResponse.ok) {
      return NextResponse.json({ error: "تعذر حفظ الصلاحيات" }, { status: 400 });
    }
  }

  if (newPassword) {
    const passwordResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
      method: "PUT",
      headers: serviceHeaders,
      body: JSON.stringify({ password: newPassword }),
    });
    if (!passwordResponse.ok) {
      return NextResponse.json({ error: "تم حفظ البيانات لكن تعذر تغيير كلمة المرور" }, { status: 400 });
    }
  }

  await writeAuditLog(actor.id, id, "update_user", {
    role,
    status,
    permissions,
    password_changed: Boolean(newPassword),
  });

  return NextResponse.json({ ok: true });
}
