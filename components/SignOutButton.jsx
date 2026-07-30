'use client';
import { createClient } from '../lib/supabase/client';
export default function SignOutButton(){return <button className="btn" onClick={async()=>{await createClient().auth.signOut(); location.href='/';}}>تسجيل الخروج</button>}
