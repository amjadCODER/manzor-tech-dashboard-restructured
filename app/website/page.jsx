'use client'; import {useEffect} from 'react'; import AuthGate from '../../components/AuthGate';
export default function WebsitePage(){useEffect(()=>{location.href='/'},[]);return <AuthGate systemKey="website"><main className="page"><section className="card">جاري فتح الموقع...</section></main></AuthGate>}
