'use client';
import Header from '../../components/Header'; import AuthGate from '../../components/AuthGate'; import UserManagement from '../../components/settings/UserManagement';
export default function SettingsPage(){return <AuthGate adminOnly><main className="page settings-page" dir="rtl"><Header title="الاعدادات" subtitle="Users, Roles & Permissions"/><section className="settings-content"><div className="settings-toolbar"><div><h2>ادارة المستخدمين</h2><p>كل تسجيل جديد يظهر هنا كعميل ثم تحدد له الدور والانظمة</p></div></div><UserManagement/></section></main></AuthGate>}
