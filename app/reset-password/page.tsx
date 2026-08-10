"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateRecoveredPassword } from "@/lib/supabase-rest";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token") ?? "";
    setToken(accessToken);
    if (!accessToken) setError("رابط الاستعادة غير صالح او منتهي");
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("كلمة المرور يجب الا تقل عن 8 احرف");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setBusy(true);
    try {
      await updateRecoveredPassword(token, password);
      setMessage("تم تحديث كلمة المرور بنجاح");
      setTimeout(() => router.replace("/login"), 900);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "تعذر تحديث كلمة المرور");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card auth-card-focused">
        <div className="auth-heading">
          <span className="auth-eyebrow">MANZOR TECH</span>
          <h1>تعيين كلمة مرور جديدة</h1>
          <p>اكتب كلمة مرور جديدة لحسابك ثم ارجع لتسجيل الدخول.</p>
        </div>
        <form onSubmit={submit}>
          <label className="field">
            كلمة المرور الجديدة
            <input type="password" minLength={8} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label className="field">
            تاكيد كلمة المرور
            <input type="password" minLength={8} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          {error && <div className="message error">{error}</div>}
          {message && <div className="message success">{message}</div>}
          <button className="action primary full-width" disabled={busy || !token}>{busy ? "جاري الحفظ" : "حفظ كلمة المرور"}</button>
        </form>
        <Link className="auth-back-link" href="/login">العودة لتسجيل الدخول</Link>
      </section>
    </main>
  );
}
