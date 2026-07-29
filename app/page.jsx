import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <Image
          src="/manzor-tech-logo.png"
          width={220}
          height={220}
          alt="MANZOR TECH logo"
          style={{ margin: '0 auto 18px', objectFit: 'contain' }}
          priority
        />
        <h1>MANZOR TECH</h1>
        <p>Internal systems platform for operations, clients, projects, mails, and digital products.</p>
        <div className="actions">
          <Link className="btn primary" href="/login">Sign in</Link>
          <Link className="btn" href="/dashboard">Open Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
