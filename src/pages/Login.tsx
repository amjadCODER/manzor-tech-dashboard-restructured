import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login({ session }: { session: unknown }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!supabase) return setError('لم يتم إعداد اتصال قاعدة البيانات')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError('تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.')
  }

  return <main className="login-page">
    <form className="login-card" onSubmit={submit}>
      <img src="/manzor-logo.webp" alt="منظور تقني" />
      <h1>نظام إدارة العملاء</h1>
      <p>تسجيل دخول الموظفين</p>
      <label><span>البريد الإلكتروني</span><div><Mail size={18}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div></label>
      <label><span>كلمة المرور</span><div><LockKeyhole size={18}/><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></div></label>
      {error && <div className="form-error">{error}</div>}
      <button className="primary" disabled={loading}>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</button>
    </form>
  </main>
}
