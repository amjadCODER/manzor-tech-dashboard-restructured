"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  requestPasswordReset,
  select,
  signIn,
  signUp,
} from "@/lib/supabase-rest";

type Mode = "login" | "signup" | "forgot";

type LoginProfile = {
  role: "customer" | "employee" | "admin";
  status: "active" | "disabled";
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getSession()) {
      routeUser().catch(() => undefined);
    }
  }, []);

  async function routeUser() {
    const session = getSession();
    if (!session) return;

    const profiles = await select<LoginProfile[]>("profiles", `select=role,status&id=eq.${session.user.id}`);
    const profile = profiles[0];

    if (!profile) {
      setError("تعذر قراءة بيانات الحساب");
      return;
    }
    if (profile.status !== "active") {
      setError("الحساب موقوف. تواصل مع مدير النظام");
      return;
    }

    router.replace(profile.role === "customer" ? "/profile" : "/platform");
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setName("");
    setPhone("");
    setPassword("");
    setMessage("");
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "forgot") {
        await requestPasswordReset(normalizedEmail);
        setMessage("تم ارسال رابط استعادة كلمة المرور اذا كان البريد مسجلا لدينا");
        return;
      }

      if (mode === "signup") {
        const session = await signUp(normalizedEmail, password, {
          full_name: name.trim(),
          phone: phone.trim(),
        });
        setPassword("");

        if (session) {
          await routeUser();
        } else {
          setMessage("تم انشاء الحساب. تحقق من بريدك لتفعيل الحساب قبل تسجيل الدخول");
        }
        return;
      }

      await signIn(normalizedEmail, password);
      setPassword("");
      await routeUser();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "حصل خطا غير متوقع");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <div className="auth-brand-panel">
          <Link href="/" className="auth-logo-link" aria-label="العودة لموقع منظور تقني">
            <img src="/assets/manzor-logo.webp" alt="شعار منظور تقني" />
          </Link>
          <span className="auth-eyebrow">MANZOR TECH PLATFORM</span>
          <h1>اهلا وسهلا </h1>
          <p>جميع الحقيق محفوظة منظور تقني © 2026</p>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">حساب منظور تقني</span>
            <h2>{mode === "login" ? "تسجيل الدخول" : mode === "signup" ? "انشاء حساب" : "استعادة كلمة المرور"}</h2>
            <p>{mode === "forgot" ? "سيتم ارسال رابط آمن لتعيين كلمة مرور جديدة." : "  تذكر كلمة المرور جيدا لين ندبر سيرفر"}</p>
          </div>

          {mode !== "forgot" && (
            <div className="tabs" aria-label="خيارات الدخول">
              <button className={mode === "login" ? "active" : ""} type="button" onClick={() => switchMode("login")}>تسجيل الدخول</button>
              <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => switchMode("signup")}>انشاء حساب</button>
            </div>
          )}

          <form onSubmit={submit}>
            {mode === "signup" && (
              <>
                <label className="field">الاسم الكامل<input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label className="field">رقم الجوال<input required inputMode="tel" dir="ltr" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
              </>
            )}

            <label className="field">البريد الالكتروني<input type="email" dir="ltr" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>

            {mode !== "forgot" && (
              <label className="field">كلمة المرور<input type="password" dir="ltr" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            )}

            {mode === "login" && (
              <button className="text-button auth-forgot" type="button" onClick={() => switchMode("forgot")}>نسيت كلمة المرور؟</button>
            )}

            {error && <div className="message error">{error}</div>}
            {message && <div className="message success">{message}</div>}

            <button className="action primary full-width" disabled={busy}>
              {busy ? "جاري التنفيذ" : mode === "login" ? "دخول" : mode === "signup" ? "انشاء الحساب" : "ارسال رابط الاستعادة"}
            </button>
          </form>

          {mode === "forgot" && <button className="text-button auth-back-link" type="button" onClick={() => switchMode("login")}>العودة لتسجيل الدخول</button>}
          <Link className="auth-back-link" href="/">العودة للموقع</Link>
        </div>
      </section>
    </main>
  );
}
