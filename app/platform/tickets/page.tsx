"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {getSession,insert,select,update} from "@/lib/supabase-rest";

type Ticket={id:string;ticket_number:number;customer_id:string;subject:string;body:string;status:string;created_at:string;profiles?:{full_name:string;email:string}};
type Message={id:string;ticket_id:string;sender_id:string;message:string;is_staff:boolean;created_at:string};
const statusLabel:Record<string,string>={open:"مفتوحة",in_progress:"قيد المعالجة",waiting_customer:"بانتظار العميل",resolved:"تم الحل",closed:"مغلقة"};
const ticketCode=(n:number)=>`MT-${String(n||0).padStart(6,"0")}`;

export default function Tickets(){
 const router=useRouter();
 const [items,setItems]=useState<Ticket[]>([]);const [messages,setMessages]=useState<Message[]>([]);const [activeId,setActiveId]=useState<string|null>(null);const [reply,setReply]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 async function load(){setError("");const s=getSession();if(!s)return router.replace("/login");const profile=(await select<any[]>("profiles",`select=role,status&id=eq.${s.user.id}`))[0];if(!profile||profile.status!=="active"||profile.role==="customer")return router.replace("/profile");const [t,m]=await Promise.all([select<Ticket[]>("tickets","select=*,profiles(full_name,email)&order=created_at.desc"),select<Message[]>("ticket_messages","select=*&order=created_at.asc")]);setItems(t);setMessages(m);if(!activeId&&t[0])setActiveId(t[0].id)}
 useEffect(()=>{load().catch(e=>setError(e.message||"تعذر تحميل التذاكر"))},[]);
 const active=items.find(t=>t.id===activeId)||null;const thread=useMemo(()=>messages.filter(m=>m.ticket_id===activeId),[messages,activeId]);
 async function sendReply(e:FormEvent){e.preventDefault();if(!active||!reply.trim())return;setBusy(true);setError("");try{const s=getSession();if(!s)throw new Error("انتهت جلسة الدخول");await insert("ticket_messages",{ticket_id:active.id,sender_id:s.user.id,message:reply.trim()});await update("tickets",`id=eq.${active.id}`,{status:"waiting_customer"});setReply("");await load()}catch(e:any){setError(e.message||"تعذر ارسال الرد")}finally{setBusy(false)}}
 async function changeStatus(status:string){if(!active)return;setBusy(true);try{await update("tickets",`id=eq.${active.id}`,{status});await load()}catch(e:any){setError(e.message||"تعذر تحديث الحالة")}finally{setBusy(false)}}
 return <main className="app-shell"><div className="topbar"><Link href="/platform">العودة للمنصة</Link><strong>تذاكر العملاء — Customer Tickets</strong></div>
 <section className="panel ticket-admin-layout"><aside className="ticket-sidebar"><h1>التذاكر</h1>{error&&<div className="message error">{error}</div>}<div className="ticket-list">{items.map(t=><button key={t.id} className={`ticket ticket-select ${activeId===t.id?"active":""}`} onClick={()=>setActiveId(t.id)}><span className="ticket-code">{ticketCode(t.ticket_number)}</span><strong>{t.subject}</strong><small>{t.profiles?.full_name||"عميل"} · {statusLabel[t.status]||t.status}</small></button>)}{!items.length&&<p>لا توجد تذاكر حاليا</p>}</div></aside>
 <div className="ticket-detail">{active?<><div className="ticket-detail-head"><div><span className="ticket-code">{ticketCode(active.ticket_number)}</span><h2>{active.subject}</h2><p>{active.profiles?.full_name} — {active.profiles?.email}</p></div><label className="status-control">الحالة<select value={active.status} disabled={busy} onChange={(e:any)=>changeStatus(e.target.value)}><option value="open">مفتوحة</option><option value="in_progress">قيد المعالجة</option><option value="waiting_customer">بانتظار العميل</option><option value="resolved">تم الحل</option><option value="closed">مغلقة</option></select></label></div>
 <div className="conversation"><article className="bubble customer"><small>رسالة العميل</small><p>{active.body}</p></article>{thread.map(m=><article key={m.id} className={`bubble ${m.is_staff?"staff":"customer"}`}><small>{m.is_staff?"رد الدعم":"رد العميل"}</small><p>{m.message}</p><time>{new Date(m.created_at).toLocaleString("ar-SA")}</time></article>)}</div>
 <form className="reply-form" onSubmit={sendReply}><label className="field">الرد على العميل<textarea required rows={4} value={reply} onChange={(e:any)=>setReply(e.target.value)} placeholder="اكتب الرد هنا"/></label><button className="action primary" disabled={busy}>{busy?"جاري الارسال":"ارسال الرد"}</button></form></>:<div className="empty-state">اختر تذكرة لعرض تفاصيلها والرد عليها</div>}</div></section></main>}
