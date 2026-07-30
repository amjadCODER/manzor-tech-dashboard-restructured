"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {getSession,select,signOut} from "@/lib/supabase-rest";
import {APPS} from "@/lib/apps";
import AppIcon from "@/components/AppIcon";

export default function Platform(){
 const [p,setP]=useState<any>(null);const [perms,setPerms]=useState<string[]>([]);const router=useRouter();
 useEffect(()=>{(async()=>{const s=getSession();if(!s)return router.replace("/login");const profiles=await select<any[]>("profiles","select=*&id=eq."+s.user.id);const data=profiles[0];if(!data||data.status!=="active")return router.replace("/login");if(data.role==="customer")return router.replace("/profile");setP(data);const up=await select<any[]>("user_permissions","select=app_key&user_id=eq."+s.user.id);setPerms(up.map(x=>x.app_key))})().catch(()=>router.replace("/login"))},[router]);
 function logout(){signOut();router.replace("/")}
 if(!p)return <div className="loading">جاري تحميل المنصة</div>;
 const visible=APPS.filter(a=>p.role==="admin"||perms.includes(a.key));
 return <main className="app-shell platform-shell">
  <header className="platform-header">
   <Link className="platform-brand" href="/" aria-label="منظور تقني">
    <img src="/assets/manzor-logo.webp" alt="شعار منظور تقني"/>
    <span><strong>منصة منظور تقني</strong><small>MANZOR TECH PLATFORM</small></span>
   </Link>
   <div className="platform-user"><span><small>مرحبا بك</small><strong>{p.full_name}</strong></span><Link className="platform-nav-btn" href="/">الموقع</Link><button className="platform-nav-btn" onClick={logout}>تسجيل الخروج</button></div>
  </header>
  <section className="platform-hero">
   <div><span className="platform-kicker">مركز الانظمة الرقمية</span><h1>كل ادوات العمل في منصة واحدة</h1><p>وصول منظم وسريع للانظمة المصرح بها حسب دورك وصلاحيات حسابك</p></div>
   <div className="platform-stat"><strong>{visible.length}</strong><span>نظام متاح لحسابك</span></div>
  </section>
  <section className="systems-panel">
   <div className="systems-heading"><div><span>الانظمة</span><h2>اختر النظام المطلوب</h2></div><small>تفتح الانظمة الخارجية في تبويب جديد</small></div>
   <div className="apps-grid">{visible.map(a=><a key={a.key} className={`app-card ${a.url==="#"?"is-coming":""}`} href={a.url==="#"?undefined:a.url} target={a.url.startsWith("http")?"_blank":undefined} rel={a.url.startsWith("http")?"noreferrer":undefined} aria-disabled={a.url==="#"} onClick={e=>{if(a.url==="#")e.preventDefault()}}><div className="app-icon"><AppIcon name={a.icon}/></div><div className="app-card-copy"><h3>{a.ar}</h3><small>{a.en}</small></div><span className="app-arrow">←</span>{a.url==="#"&&<em>قريبا</em>}</a>)}</div>
  </section>
 </main>
}
