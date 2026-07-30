# MANZOR TECH Platform

مشروع Full Stack موحد: الموقع العام + تسجيل الدخول وانشاء الحساب + ملف العميل + منصة الانظمة + ادارة المستخدمين والصلاحيات.

## التشغيل

1. انشئ مشروع Supabase.
2. افتح SQL Editor وشغل الملف: `supabase/platform-schema.sql`.
3. انشئ اول حساب من الموقع، ثم نفذ امر ترقية اول مدير الموجود في نهاية ملف SQL بعد استبدال البريد.
4. اضف متغيرات البيئة محليا وفي Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> مفتاح Service Role يوضع في Vercel فقط ولا يضاف للواجهة ولا يرفع لمستودع عام.

5. شغل:

```bash
npm install
npm run build
npm run dev
```

## التدفق

- `/` الموقع العام الاصلي محفوظ بتصميمه وحركاته.
- `/login` تسجيل الدخول وانشاء الحساب.
- كل مستخدم جديد يسجل بدور `customer` تلقائيا.
- العميل يوجه الى `/profile`.
- الموظف والمدير يوجهان الى `/dashboard`.
- المدير فقط يدخل `/settings` ويغير الدور والحالة وصلاحيات الانظمة.
- صلاحيات الادارة تحفظ فعليا في Supabase عبر API محمي والتحقق من Access Token.
