'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import { systems } from '../../lib/systems';
import { Search, UserPlus, ShieldCheck, SlidersHorizontal, History, MoreHorizontal } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'مدير النظام', email: 'admin@manzortech.sa', role: 'admin', status: 'active', lastLogin: 'اليوم', apps: systems.map((item) => item.href) },
  { id: 2, name: 'موظف تجريبي', email: 'employee@manzortech.sa', role: 'employee', status: 'active', lastLogin: 'منذ ساعتين', apps: ['/customers', '/monitor', '/customer-tickets'] },
  { id: 3, name: 'عميل تجريبي', email: 'client@example.com', role: 'customer', status: 'active', lastLogin: 'أمس', apps: ['/customer-tickets'] },
];

const roleLabel = { admin: 'مدير', employee: 'موظف', customer: 'عميل' };
const roleClass = { admin: 'role-admin', employee: 'role-employee', customer: 'role-customer' };

export default function SettingsPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialUsers[0].id);

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(value));
  }, [query, users]);

  const selectedUser = users.find((user) => user.id === selectedId) || users[0];

  const updateSelected = (changes) => {
    setUsers((current) => current.map((user) => user.id === selectedId ? { ...user, ...changes } : user));
  };

  const toggleSystem = (href) => {
    const hasAccess = selectedUser.apps.includes(href);
    updateSelected({ apps: hasAccess ? selectedUser.apps.filter((item) => item !== href) : [...selectedUser.apps, href] });
  };

  return (
    <main className="page settings-page" dir="rtl">
      <Header title="الإعدادات" subtitle="Settings & Access Control" />

      <section className="settings-shell">
        <nav className="settings-tabs" aria-label="أقسام الإعدادات">
          <button className={tab === 'users' ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab('users')}><UserPlus size={19}/> المستخدمون</button>
          <button className={tab === 'roles' ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab('roles')}><ShieldCheck size={19}/> الأدوار والصلاحيات</button>
          <button className={tab === 'platform' ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab('platform')}><SlidersHorizontal size={19}/> إعدادات المنصة</button>
          <button className={tab === 'activity' ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab('activity')}><History size={19}/> سجل النشاط</button>
        </nav>

        {tab === 'users' && (
          <div className="settings-content">
            <div className="settings-toolbar">
              <div>
                <h2>إدارة المستخدمين</h2>
                <p>كل تسجيل جديد يبدأ كعميل، ويمكن للمدير تحويله إلى موظف ومنحه صلاحيات الأنظمة.</p>
              </div>
              <button className="btn primary"><UserPlus size={18}/> إضافة مستخدم</button>
            </div>

            <div className="user-management-grid">
              <section className="card users-panel">
                <label className="search-field">
                  <Search size={18}/>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو البريد" />
                </label>

                <div className="users-list">
                  {filteredUsers.map((user) => (
                    <button key={user.id} className={user.id === selectedId ? 'user-row active' : 'user-row'} onClick={() => setSelectedId(user.id)}>
                      <span className="avatar">{user.name.slice(0, 1)}</span>
                      <span className="user-main"><strong>{user.name}</strong><small>{user.email}</small></span>
                      <span className={`role-badge ${roleClass[user.role]}`}>{roleLabel[user.role]}</span>
                      <MoreHorizontal size={18}/>
                    </button>
                  ))}
                </div>
              </section>

              <section className="card access-panel">
                <div className="profile-head">
                  <span className="avatar large">{selectedUser.name.slice(0, 1)}</span>
                  <div><h3>{selectedUser.name}</h3><p>{selectedUser.email}</p></div>
                </div>

                <div className="settings-form-grid">
                  <label>نوع الحساب
                    <select value={selectedUser.role} onChange={(event) => updateSelected({ role: event.target.value })}>
                      <option value="customer">عميل — Customer</option>
                      <option value="employee">موظف — Employee</option>
                      <option value="admin">مدير — Admin</option>
                    </select>
                  </label>
                  <label>حالة الحساب
                    <select value={selectedUser.status} onChange={(event) => updateSelected({ status: event.target.value })}>
                      <option value="active">نشط</option>
                      <option value="suspended">موقوف</option>
                    </select>
                  </label>
                </div>

                <div className="permissions-head">
                  <div><h3>صلاحيات الأنظمة</h3><p>اختر الأيقونات التي تظهر لهذا المستخدم داخل المنصة.</p></div>
                  <span>{selectedUser.apps.length} نظام</span>
                </div>

                <div className="permissions-grid">
                  {systems.map((system) => {
                    const Icon = system.icon;
                    const enabled = selectedUser.apps.includes(system.href);
                    return (
                      <button key={system.href} className={enabled ? 'permission-card enabled' : 'permission-card'} onClick={() => toggleSystem(system.href)}>
                        <span className="permission-icon"><Icon size={20}/></span>
                        <span><strong>{system.titleAr}</strong><small>{system.titleEn}</small></span>
                        <span className={enabled ? 'switch on' : 'switch'}><i/></span>
                      </button>
                    );
                  })}
                </div>

                <div className="settings-actions">
                  <button className="btn">إلغاء</button>
                  <button className="btn primary">حفظ التغييرات</button>
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === 'roles' && <SimplePanel title="الأدوار والصلاحيات" text="إدارة الأدوار الأساسية: عميل، موظف، ومدير، مع صلاحيات منفصلة لكل نظام وإجراء." />}
        {tab === 'platform' && <SimplePanel title="إعدادات المنصة" text="إدارة اسم المنصة، الشعار، ترتيب الأنظمة، روابطها، وحالة ظهور كل نظام." />}
        {tab === 'activity' && <SimplePanel title="سجل النشاط" text="سجل تغييرات المستخدمين والصلاحيات وتسجيلات الدخول والإجراءات الإدارية." />}
      </section>
    </main>
  );
}

function SimplePanel({ title, text }) {
  return <section className="card settings-empty"><h2>{title}</h2><p>{text}</p><span>جاهز للربط بقاعدة البيانات بعد اعتماد الواجهة</span></section>;
}
