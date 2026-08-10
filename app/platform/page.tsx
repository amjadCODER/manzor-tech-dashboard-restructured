"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/AppIcon";
import { APPS } from "@/lib/apps";
import { getSession, select, signOut } from "@/lib/supabase-rest";

type Profile = { id: string; full_name: string; email: string; role: "customer" | "employee" | "admin"; status: string };

export default function PlatformPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const session = getSession();
      if (!session) return router.replace("/login");

      const profiles = await select<Profile[]>("profiles", `select=*&id=eq.${session.user.id}`);
      const currentProfile = profiles[0];
      if (!currentProfile || currentProfile.status !== "active") return router.replace("/login");
      if (currentProfile.role === "customer") return router.replace("/profile");

      setProfile(currentProfile);
      const userPermissions = await select<{ app_key: string }[]>("user_permissions", `select=app_key&user_id=eq.${session.user.id}`);
      setPermissions(userPermissions.map((item) => item.app_key));
    }

    load().catch(() => router.replace("/login"));
  }, [router]);

  function logout() {
    signOut();
    router.replace("/");
  }

  if (!profile) return <div className="loading">جاري تحميل المنصة</div>;

  const visibleApps = APPS.filter((app) => profile.role === "admin" || permissions.includes(app.key));

  return (
    <main className="platform-shell">
      <header className="platform-header">
        <Link className="platform-brand" href="/" aria-label="منظور تقني">
          <img src="/assets/manzor-logo.webp" alt="شعار منظور تقني" />
          <span><strong>منصة منظور تقني</strong><small>MANZOR TECH PLATFORM</small></span>
        </Link>
        <div className="platform-user">
          <span><small>مرحبا بك</small><strong>{profile.full_name}</strong></span>
          {profile.role === "admin" && <Link className="platform-nav-btn" href="/platform/settings">الاعدادات</Link>}
          <Link className="platform-nav-btn" href="/">الموقع</Link>
          <button className="platform-nav-btn" onClick={logout}>تسجيل الخروج</button>
        </div>
      </header>

      <section className="platform-hero">
        <div className="platform-hero-copy">
          <span className="platform-kicker">مركز الانظمة الرقمية</span>
          <h1>كل ادوات العمل في منصة واحدة</h1>
          <p>وصول منظم وسريع للانظمة المصرح بها حسب دورك وصلاحيات حسابك.</p>
        </div>
        <div className="platform-stat"><strong>{visibleApps.length}</strong><span>نظام متاح لحسابك</span></div>
      </section>

      <section className="systems-panel">
        <div className="systems-heading"><div><span>الانظمة</span><h2>اختر النظام المطلوب</h2></div><small>الانظمة الخارجية تفتح في تبويب جديد</small></div>
        <div className="apps-grid">
          {visibleApps.map((app) => {
            const isComingSoon = app.url === "#";
            return (
              <a key={app.key} className={`app-card ${isComingSoon ? "is-coming" : ""}`} href={isComingSoon ? undefined : app.url} target={app.url.startsWith("http") ? "_blank" : undefined} rel={app.url.startsWith("http") ? "noreferrer" : undefined} aria-disabled={isComingSoon} onClick={(event) => { if (isComingSoon) event.preventDefault(); }}>
                <div className="app-icon"><AppIcon name={app.icon} /></div>
                <div className="app-card-copy"><h3>{app.ar}</h3><small>{app.en}</small></div>
                <span className="app-arrow">←</span>
                {isComingSoon && <em>قريبا</em>}
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
