'use client';
import AuthGate from './AuthGate'; import Placeholder from './Placeholder';
export default function ProtectedPlaceholder({systemKey,title,subtitle}){return <AuthGate systemKey={systemKey}><Placeholder title={title} subtitle={subtitle}/></AuthGate>}
