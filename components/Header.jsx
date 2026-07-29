import Image from 'next/image';
import Link from 'next/link';

export default function Header({ title = 'MANZOR TECH SYSTEMS', subtitle = 'All systems in one place' }) {
  return (
    <header className="topbar">
      <Link href="/dashboard" className="brand" aria-label="MANZOR TECH dashboard">
        <Image
          className="brand-logo"
          src="/manzor-tech-icon.png"
          width={152}
          height={152}
          alt="MANZOR TECH logo"
          priority
        />
        <div className="brand-copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </Link>

      <Link className="btn dashboard-btn" href="/dashboard">
        Main Dashboard
      </Link>
    </header>
  );
}
