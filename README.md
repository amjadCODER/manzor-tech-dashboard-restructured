# Manzor Tech Platform

منصة داخلية موحدة لادارة الوصول الى انظمة منظور تقني، حسابات المستخدمين، الصلاحيات، وتذاكر الدعم.

## المتطلبات

- Node.js 20.9 او احدث
- مشروع Supabase مهيأ
- متغيرات البيئة المطلوبة

## التشغيل المحلي

```bash
npm install
npm run dev
```

للتحقق قبل النشر:

```bash
npm run typecheck
npm run build
```

## متغيرات البيئة

يحتاج المشروع الى المتغيرات التالية:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

للتشغيل المحلي، انسخ `.env.example` الى `.env.local` واضف القيم الفعلية. يجب ان يبقى `SUPABASE_SERVICE_ROLE_KEY` على الخادم فقط، ولا يستخدم داخل اي متغير يبدأ بـ `NEXT_PUBLIC_`.

## المسارات الرئيسية

| المسار | الوصف |
| --- | --- |
| `/` | الموقع الرئيسي |
| `/login` | تسجيل الدخول وانشاء الحساب واستعادة كلمة المرور |
| `/reset-password` | تعيين كلمة مرور جديدة من رابط الاستعادة |
| `/profile` | ملف العميل وتذاكره |
| `/platform` | لوحة الانظمة للموظفين والادمن |
| `/platform/settings` | ادارة المستخدمين والصلاحيات |
| `/platform/tickets` | ادارة تذاكر العملاء |

## قاعدة البيانات

ملف التهيئة الرئيسي:

```text
supabase/schema.sql
```

يشمل الجداول والسياسات والتريغرز والفهارس اللازمة للتشغيل، بما فيها حسابات المستخدمين، الصلاحيات، سجلات النشاط، التذاكر، والردود.

ملف الترقية التالي محفوظ لدعم البيئات التي طبقت نظام التذاكر قبل دمجه في المخطط الرئيسي:

```text
supabase/ticket-messages-upgrade.sql
```

## المصادقة

التسجيل يمنع تكرار البريد الالكتروني، وتدعم صفحة الدخول استعادة كلمة المرور. مسار العودة المعتمد داخل التطبيق هو:

```text
/reset-password
```

يجب اضافة رابط الانتاج الكامل لهذا المسار الى Supabase Authentication ضمن Redirect URLs. يفضل اضافة رابط بيئة الاختبار ايضا عند استخدامها.

## ادارة المستخدمين

يستطيع الادمن من شاشة الاعدادات:

- تغيير دور المستخدم.
- تفعيل الحساب او ايقافه.
- تحديد صلاحيات الانظمة.
- تعيين كلمة مرور جديدة للمستخدم.

تغيير كلمة المرور يتم من Route Handler على الخادم بعد التحقق من صلاحية الادمن. لا يتم تسجيل كلمة المرور في سجل النشاط.

## الانظمة المرتبطة

- Email Dashboard: `https://manzor-mai-ls.vercel.app/`
- Email Sender: `https://mails-sender-apis.vercel.app`
- WhatsApp Sender: `https://whatsapp-photo.vercel.app/`
- Task Monitor: `https://manzor-task-screen.vercel.app/monitor`
- Manzor Vault: `https://manzor-tech-vault.vercel.app/`

## النشر

قبل نشر نسخة انتاج:

1. تحقق من متغيرات البيئة في Vercel.
2. طبق `supabase/schema.sql` على قاعدة البيانات المستهدفة.
3. اضف رابط `/reset-password` للدومين المستخدم في Supabase Redirect URLs.
4. شغل `npm run typecheck`.
5. شغل `npm run build`.
6. انشر النسخة بعد نجاح التحقق.
