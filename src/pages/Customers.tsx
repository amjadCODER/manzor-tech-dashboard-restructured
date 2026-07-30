import { useMemo, useState } from 'react'
import { Search, Download, UserPlus, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Customer } from '../types'
import { exportCustomers } from '../lib/export'

const demo: Customer[] = []

export default function Customers(){
  const [q,setQ]=useState('')
  const [status,setStatus]=useState('')
  const nav=useNavigate()
  const filtered=useMemo(()=>demo.filter(c=>(!q||[c.name,c.customer_code,c.phone].some(v=>v.includes(q)))&&(!status||c.status===status)),[q,status])
  return <section className="panel">
    <div className="panel-head">
      <div><h2>العملاء</h2><p>إدارة بيانات العملاء وحالاتهم ومستنداتهم</p></div>
      <div className="actions"><button className="secondary" onClick={()=>exportCustomers(filtered)}><Download size={18}/> تصدير Excel</button><button className="primary" onClick={()=>nav('/contracts/new')}><UserPlus size={18}/> إضافة عميل وعقد</button></div>
    </div>
    <div className="filters">
      <label className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="البحث بالاسم أو رقم العميل أو الجوال"/></label>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">جميع الحالات</option><option>مشترك</option><option>جاري خدمته</option><option>منجز</option><option>متوقف</option><option>ملغي</option></select>
    </div>
    <div className="table-wrap"><table><thead><tr><th>رقم العميل</th><th>العميل</th><th>التواصل</th><th>الحالة</th><th>تاريخ الإنشاء</th><th></th></tr></thead>
      <tbody>{filtered.length?filtered.map(c=><tr key={c.id}><td>{c.customer_code}</td><td><b>{c.name}</b><small>{c.organization_name}</small></td><td>{c.phone}<small>{c.email}</small></td><td><span className="badge">{c.status}</span></td><td>{new Date(c.created_at).toLocaleDateString('ar-SA')}</td><td><button className="icon-btn" onClick={()=>nav(`/customers/${c.id}`)}><Eye size={18}/></button></td></tr>):<tr><td colSpan={6}><div className="empty"><UserPlus/><h3>لا يوجد عملاء حتى الآن</h3><p>يتم إنشاء العميل تلقائيا عند إنشاء أول عقد.</p></div></td></tr>}</tbody>
    </table></div>
  </section>
}
