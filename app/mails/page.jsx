'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { emailAccounts } from '../../lib/emailAccounts';

export default function Mails() {
  const [rows, setRows] = useState(emailAccounts);
  const [form, setForm] = useState({ client: '', organization: '', email: '', category: '', inboxUrl: '' });

  useEffect(() => {
    const saved = localStorage.getItem('mt_mails');
    if (saved) setRows(JSON.parse(saved));
  }, []);

  useEffect(() => localStorage.setItem('mt_mails', JSON.stringify(rows)), [rows]);

  function add(e) {
    e.preventDefault();
    if (!form.client || !form.email) return;
    setRows([{ ...form }, ...rows]);
    setForm({ client: '', organization: '', email: '', category: '', inboxUrl: '' });
  }

  return (
    <main className="page">
      <Header title="منظور تيك ميلز" subtitle="Client Emails & Inbox" />
      <section className="card">
        <h2 className="section-title">إضافة إيميل عميل</h2>
        <form className="form" onSubmit={add}>
          <input className="input" placeholder="اسم العميل" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <input className="input" placeholder="اسم الجهة" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <input className="input" placeholder="الإيميل" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="رابط الوارد" value={form.inboxUrl} onChange={(e) => setForm({ ...form, inboxUrl: e.target.value })} />
          <input className="input" placeholder="التصنيف" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <button className="btn primary">إضافة</button>
        </form>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">قائمة الإيميلات</h2>
        <table className="table">
          <thead>
            <tr><th>العميل</th><th>الجهة</th><th>الإيميل</th><th>التصنيف</th><th>الوارد</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.client}</td>
                <td>{r.organization}</td>
                <td>{r.email}</td>
                <td>{r.category}</td>
                <td>{r.inboxUrl ? <a className="btn" href={r.inboxUrl} target="_blank">فتح</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
