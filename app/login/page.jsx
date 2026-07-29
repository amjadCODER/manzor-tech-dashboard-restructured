import Link from 'next/link';

export default function Login() {
  return (
    <main className="page">
      <section className="hero card">
        <h1>Admin Sign In</h1>
        <p>MANZOR TECH platform access</p>
        <div className="form" style={{ maxWidth: 520, margin: '20px auto' }}>
          <input className="input" placeholder="Email address" />
          <input className="input" placeholder="Password" type="password" />
        </div>
        <Link className="btn primary" href="/dashboard">Sign in</Link>
      </section>
    </main>
  );
}
