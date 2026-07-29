import Link from 'next/link';
import Header from '../../components/Header';
import { systems } from '../../lib/systems';

export default function Dashboard() {
  return (
    <main className="page dashboard-page">
      <Header title="MANZOR TECH SYSTEMS" subtitle="All systems in one place" />

      <section className="grid systems-grid" aria-label="MANZOR TECH systems">
        {systems.map((system) => {
          const Icon = system.icon;
          return (
            <Link className="card app-card" href={system.href} key={system.href}>
              <div className="iconbox">
                <Icon size={30} strokeWidth={2.2} />
              </div>
              <div className="card-content">
                <h3>{system.titleAr}</h3>
                <p className="muted">{system.titleEn}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <footer className="site-footer">© 2026 MANZOR TECH. All rights reserved.</footer>
    </main>
  );
}
