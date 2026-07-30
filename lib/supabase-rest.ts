export type Session={access_token:string;refresh_token:string;expires_at:number;user:{id:string;email?:string}};
const rawUrl=process.env.NEXT_PUBLIC_SUPABASE_URL||"";
const url=rawUrl.trim().replace(/\/$/, "").replace(/\/(rest|auth)\/v1.*$/i, "");
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"";
const SESSION_KEY="manzor_session";
function headers(token?:string){return {apikey:key,Authorization:`Bearer ${token||key}`,"Content-Type":"application/json"};}
function configured(){
  if(!url||!key)throw new Error("اعدادات Supabase غير مضافة");
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url))throw new Error("رابط Supabase غير صحيح. استخدمي Project URL فقط بدون rest/v1");
}
export function getSession():Session|null{if(typeof window==="undefined")return null;const raw=localStorage.getItem(SESSION_KEY);if(!raw)return null;try{return JSON.parse(raw)}catch{return null}}
function saveSession(data:any){const session:Session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600),user:data.user};localStorage.setItem(SESSION_KEY,JSON.stringify(session));return session}
export async function signUp(email:string,password:string,meta:{full_name:string;phone:string}){configured();const r=await fetch(`${url}/auth/v1/signup`,{method:"POST",headers:headers(),body:JSON.stringify({email,password,data:meta})});const data=await r.json();if(!r.ok)throw new Error(data.msg||data.message||"فشل انشاء الحساب");if(data.access_token)return saveSession(data);return null}
export async function signIn(email:string,password:string){configured();const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:headers(),body:JSON.stringify({email,password})});const data=await r.json();if(!r.ok)throw new Error(data.error_description||data.msg||"بيانات الدخول غير صحيحة");return saveSession(data)}
export function signOut(){if(typeof window!=="undefined")localStorage.removeItem(SESSION_KEY)}
export async function getUser(){const s=getSession();if(!s)return null;const r=await fetch(`${url}/auth/v1/user`,{headers:headers(s.access_token)});if(!r.ok){signOut();return null}return r.json()}
export async function select<T=any>(table:string,query:string=""){configured();const s=getSession();if(!s)throw new Error("غير مسجل دخول");const r=await fetch(`${url}/rest/v1/${table}?${query}`,{headers:{...headers(s.access_token),Prefer:"return=representation"}});const data=await r.json();if(!r.ok)throw new Error(data.message||"تعذر جلب البيانات");return data as T}
export async function insert<T=any>(table:string,payload:any){configured();const s=getSession();if(!s)throw new Error("غير مسجل دخول");const r=await fetch(`${url}/rest/v1/${table}`,{method:"POST",headers:{...headers(s.access_token),Prefer:"return=representation"},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.message||"تعذر حفظ البيانات");return data as T}
export async function update(table:string,query:string,payload:any){configured();const s=getSession();if(!s)throw new Error("غير مسجل دخول");const r=await fetch(`${url}/rest/v1/${table}?${query}`,{method:"PATCH",headers:{...headers(s.access_token),Prefer:"return=representation"},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.message||"تعذر التحديث");return data}
