import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, PlusCircle, Settings, Menu, X, Download } from 'lucide-react'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetails from './pages/CustomerDetails'
import Contracts from './pages/Contracts'
import NewContract from './pages/NewContract'
import Templates from './pages/Templates'

const nav = [
  {to:'/',label:'لوحة التحكم',icon:LayoutDashboard},
  {to:'/customers',label:'العملاء',icon:Users},
  {to:'/contracts',label:'العقود',icon:FileText},
  {to:'/contracts/new',label:'إنشاء عقد',icon:PlusCircle},
  {to:'/templates',label:'قوالب العقود',icon:Settings},
]

export default function App(){
  const [open,setOpen]=useState(false)
  const navigate=useNavigate()
  return <div className="app-shell">
    <aside className={open?'sidebar open':'sidebar'}>
      <div className="brand">
        <img src="/manzor-logo.webp" alt="منظور تقني"/>
        <div><strong>منظور تقني</strong><span>نظام إدارة العملاء</span></div>
      </div>
      <nav>{nav.map(i=><NavLink key={i.to} to={i.to} end={i.to==='/'} onClick={()=>setOpen(false)}>
        <i.icon size={20}/><span>{i.label}</span>
      </NavLink>)}</nav>
      <div className="sidebar-foot">Manzor Tech © 2026</div>
    </aside>
    {open&&<button className="overlay" onClick={()=>setOpen(false)} aria-label="إغلاق"/>}
    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
        <div><h1>نظام إدارة العملاء</h1><p>إدارة العملاء والعقود والمستندات</p></div>
        <button className="primary compact" onClick={()=>navigate('/contracts/new')}><PlusCircle size={18}/> إنشاء عقد</button>
      </header>
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/customers" element={<Customers/>}/>
          <Route path="/customers/:id" element={<CustomerDetails/>}/>
          <Route path="/contracts" element={<Contracts/>}/>
          <Route path="/contracts/new" element={<NewContract/>}/>
          <Route path="/templates" element={<Templates/>}/>
        </Routes>
      </div>
    </main>
  </div>
}
