# Manzor Tech Platform

## تحديث التذاكر
قبل نشر هذه النسخة، شغّل الملف التالي كاملا في Supabase SQL Editor:

`supabase/schema.sql`

الملف آمن للتشغيل على القاعدة الحالية، ويضيف:
- رقم تذكرة متسلسل بصيغة MT-001001
- محادثة وردود بين العميل والدعم
- حالات التذكرة
- سياسات RLS اللازمة

## Vercel Environment Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
