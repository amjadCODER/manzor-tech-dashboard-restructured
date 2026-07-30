'use client';
import { useEffect,useState } from 'react';
import { createClient } from '../lib/supabase/client';
export default function AuthGate({children,adminOnly=false,systemKey=null}){
 const [state,setState]=useState({loading:true,allowed:false});
 useEffect(()=>{let live=true; (async()=>{const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href=`/login?next=${encodeURIComponent(location.pathname)}`;return} const {data:p}=await s.from('profiles').select('role,status').eq('id',user.id).single(); if(p?.status==='suspended'){if(location.pathname!='/profile')location.href='/profile';return} if(adminOnly&&p?.role!=='admin'){location.href='/dashboard';return} if(systemKey&&p?.role!=='admin'){const {data}=await s.from('user_system_permissions').select('can_access').eq('user_id',user.id).eq('system_key',systemKey).eq('can_access',true).maybeSingle(); if(!data){location.href='/dashboard?denied=1';return}} if(live)setState({loading:false,allowed:true});})(); return()=>{live=false}},[adminOnly,systemKey]);
 if(state.loading)return <main className="page"><section className="card">جاري التحقق من الحساب...</section></main>;
 return state.allowed?children:null;
}
