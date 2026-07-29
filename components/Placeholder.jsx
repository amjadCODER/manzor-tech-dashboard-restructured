import Header from './Header';

export default function Placeholder({ title, subtitle }) {
  return (
    <main className="page">
      <Header title={title} subtitle={subtitle} />
      <section className="card placeholder">
        <div>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
      </section>
    </main>
  );
}
