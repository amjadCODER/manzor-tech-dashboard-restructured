'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';

export default function LoginPage() {
  const params = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login');
  const [form, setForm] = useState({ fullName:'', phone:'', email:'', password:'' });
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const next = useMemo(() => params.get('next') || '/dashboard', [params]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage('');
    const supabase = createClient();
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName, phone: form.phone }, emailRedirectTo: `${location.origin}/login` } });
      if(error){setMessage(error.message)}else{const {data:{session}}=await supabase.auth.getSession();if(session){location.href='/profile'}else{setMessage('تم انشاء الحساب. تحقق من بريدك لتأكيد الحساب ثم سجل الدخول')}}
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if(error){setMessage(error.message)}else{const {data:{user}}=await supabase.auth.getUser();const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).single();location.href=profile?.role==='customer'?'/profile':next}
    }
    setBusy(false);
  }
  return <main className="page auth-page" dir="rtl"><section className="card auth-card">
    <Link href="/" className="auth-logo"><img src="/manzor-tech-logo.png" alt="منظور تقني"/></Link>
    <h1>{mode === 'login' ? 'تسجيل الدخول' : 'انشاء حساب'}</h1><p>{mode === 'login' ? 'ادخل لحسابك او منصة الانظمة' : 'كل حساب جديد ينشأ كعميل ويظهر مباشرة في ادارة المستخدمين'}</p>
    <div className="auth-switch"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>تسجيل الدخول</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>انشاء حساب</button></div>
    <form onSubmit={submit} className="auth-form">
      {mode==='signup' && <><label>الاسم الكامل<input required name="fullName" value={form.fullName} onChange={change}/></label><label>رقم الجوال<input required name="phone" value={form.phone} onChange={change}/></label></>}
      <label>البريد الالكتروني<input required type="email" name="email" value={form.email} onChange={change}/></label>
      <label>كلمة المرور<input required minLength="8" type="password" name="password" value={form.password} onChange={change}/></label>
      {message && <div className="auth-message">{message}</div>}
      <button disabled={busy} className="btn primary" type="submit">{busy?'جاري التنفيذ...':mode==='login'?'دخول':'انشاء الحساب'}</button>
    </form><Link href="/" className="back-link">الرجوع للموقع</Link>
  </section></main>;
}
