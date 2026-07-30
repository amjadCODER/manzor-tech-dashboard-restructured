'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';

const seed = [
  { name: 'Manzor Tech Platform', type: 'منصة', url: 'https://manzor-tech.vercel.app', version: 'v1.0', host: 'Vercel' },
  { name: 'Manzor Tech Mails', type: 'نظام', url: '/mails', version: 'v1.0', host: 'Internal' },
];

export default function Products() {
  const [rows, setRows] = useState(seed);
  const [form, setForm] = useState({ name: '', type: '', url: '', version: '', host: '' });

  useEffect(() => {
    const saved = localStorage.getItem('mt_products');
    if (saved) setRows(JSON.parse(saved));
  }, []);

  useEffect(() => localStorage.setItem('mt_products', JSON.stringify(rows)), [rows]);

  function add(e) {
    e.preventDefault();
    if (!form.name || !form.url) return;
    setRows([{ ...form }, ...rows]);
    setForm({ name: '', type: '', url: '', version: '', host: '' });
  }

  return (
    <main className="page">
      <Header title="منتجات منظور تيك" subtitle="Products" />
      <section className="card">
        <h2 className="section-title">إضافة منتج / مشروع</h2>
        <form className="form" onSubmit={add}>
          <input className="input" placeholder="اسم المشروع" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="النوع" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input className="input" placeholder="الرابط" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input className="input" placeholder="الإصدار" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
          <input className="input" placeholder="الاستضافة" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
          <button className="btn primary">إضافة</button>
        </form>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">Dashboard المنتجات</h2>
        <table className="table">
          <thead>
            <tr><th>اسم المشروع</th><th>النوع</th><th>الرابط</th><th>الإصدار</th><th>الاستضافة</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{r.name}</td><td>{r.type}</td><td><a className="btn" href={r.url} target="_blank">فتح الرابط</a></td><td>{r.version}</td><td>{r.host}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
