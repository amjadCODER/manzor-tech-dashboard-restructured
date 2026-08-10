"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { APPS } from "@/lib/apps";
import { getAccessToken, getSession, select } from "@/lib/supabase-rest";

type UserRecord = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: "customer" | "employee" | "admin";
  status: "active" | "disabled";
  created_at: string;
};
type AdminProfile = {
  role: UserRecord["role"];
  status: UserRecord["status"];
};

type UserPermission = {
  app_key: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selected, setSelected] = useState<UserRecord | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) =>
      [user.full_name, user.email, user.phone, user.role, user.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    );
  }, [query, users]);

  async function loadUsers() {
    const session = getSession();
    if (!session) return router.replace("/login");

    const profile = (await select<AdminProfile[]>("profiles", `select=role,status&id=eq.${session.user.id}`))[0];
    if (profile?.role !== "admin" || profile?.status !== "active") {
      return router.replace("/platform");
    }

    const response = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "تعذر تحميل المستخدمين");
    setUsers(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadUsers().catch((exception) => {
      setError(exception instanceof Error ? exception.message : "تعذر تحميل المستخدمين");
    });
  }, []);

  async function chooseUser(user: UserRecord) {
    setError("");
    setMessage("");
    setNewPassword("");
    setSelected({ ...user });
    const data = await select<UserPermission[]>("user_permissions", `select=app_key&user_id=eq.${user.id}`);
    setPermissions(data.map((item) => item.app_key));
  }

  async function saveUser() {
    if (!selected) return;
    if (newPassword && newPassword.length < 8) {
      setError("كلمة المرور الجديدة يجب الا تقل عن 8 احرف");
      return;
    }

    const session = getSession();
    if (!session) return router.replace("/login");

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          id: selected.id,
          role: selected.role,
          status: selected.status,
          permissions,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "تعذر حفظ التعديلات");

      setMessage(newPassword ? "تم حفظ التعديلات وتغيير كلمة المرور" : "تم حفظ التعديلات");
      setNewPassword("");
      await loadUsers();
      setSelected((current) => current ? { ...current } : current);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "تعذر حفظ التعديلات");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell settings-shell">
      <header className="workspace-header">
        <div>
          <span className="workspace-kicker">ADMINISTRATION</span>
          <h1>ادارة المستخدمين والصلاحيات</h1>
          <p>ادارة الحسابات وحالتها وصلاحيات الانظمة وكلمات المرور من مكان واحد.</p>
        </div>
        <Link className="platform-nav-btn" href="/platform">العودة للمنصة</Link>
      </header>

      <div className="settings-layout">
        <section className="panel users-panel">
          <div className="panel-heading-row">
            <div><h2>المستخدمون</h2><small>{users.length} حساب</small></div>
            <input className="compact-search" type="search" placeholder="ابحث بالاسم او البريد" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="user-list" role="list">
            {filteredUsers.map((user) => (
              <button key={user.id} type="button" className={`user-list-item ${selected?.id === user.id ? "active" : ""}`} onClick={() => chooseUser(user)}>
                <span className="user-avatar">{user.full_name?.trim()?.charAt(0) || "م"}</span>
                <span className="user-list-copy"><strong>{user.full_name || "بدون اسم"}</strong><small dir="ltr">{user.email}</small></span>
                <span className={`status-pill ${user.status}`}>{user.status === "active" ? "فعال" : "موقوف"}</span>
              </button>
            ))}
            {!filteredUsers.length && <div className="empty-state compact">لا توجد نتائج</div>}
          </div>
        </section>

        <section className="panel user-editor-panel">
          {!selected ? (
            <div className="empty-state"><div><h2>اختر مستخدما</h2><p>اختر حسابا من القائمة لتعديل الدور والصلاحيات او كلمة المرور.</p></div></div>
          ) : (
            <>
              <div className="user-editor-heading">
                <div><span className="workspace-kicker">USER ACCESS</span><h2>{selected.full_name || "بدون اسم"}</h2><p dir="ltr">{selected.email}</p></div>
                <span className={`status-pill ${selected.status}`}>{selected.status === "active" ? "فعال" : "موقوف"}</span>
              </div>

              <div className="form-grid two-columns">
                <label className="field">نوع الحساب<select value={selected.role} onChange={(event) => setSelected({ ...selected, role: event.target.value as UserRecord["role"] })}><option value="customer">عميل</option><option value="employee">موظف</option><option value="admin">ادمن</option></select></label>
                <label className="field">حالة الحساب<select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value as UserRecord["status"] })}><option value="active">فعال</option><option value="disabled">موقوف</option></select></label>
              </div>

              <div className="editor-section">
                <div className="section-copy"><h3>صلاحيات الانظمة</h3><p>حدد الانظمة التي تظهر لهذا المستخدم. الادمن يملك وصولا كاملا تلقائيا.</p></div>
                <div className="perm-grid">
                  {APPS.filter((app) => app.key !== "settings").map((app) => (
                    <label className="perm" key={app.key}>
                      <input type="checkbox" disabled={selected.role === "admin"} checked={selected.role === "admin" || permissions.includes(app.key)} onChange={(event) => setPermissions(event.target.checked ? [...permissions, app.key] : permissions.filter((key) => key !== app.key))} />
                      <span><strong>{app.ar}</strong><small>{app.en}</small></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="editor-section password-section">
                <div className="section-copy"><h3>تغيير كلمة المرور</h3><p>اترك الحقل فارغا اذا لم ترغب في تغييرها. يجب الا تقل كلمة المرور عن 8 احرف.</p></div>
                <label className="field no-margin"><span>كلمة مرور جديدة</span><input type="password" minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="اكتب كلمة المرور الجديدة" /></label>
              </div>

              {error && <div className="message error">{error}</div>}
              {message && <div className="message success">{message}</div>}
              <div className="editor-actions"><button className="action primary" type="button" disabled={busy} onClick={saveUser}>{busy ? "جاري الحفظ" : "حفظ التعديلات"}</button></div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
