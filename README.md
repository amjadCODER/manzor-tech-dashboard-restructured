# نظام إدارة العملاء — منظور تقني

## Supabase

1. افتح SQL Editor وشغّل الملف التالي كاملا مرة واحدة:
   `supabase/customer_management_complete.sql`
2. من Project Settings > API > Exposed schemas أضف:
   `customer_management`
3. متغيرات Vercel:

```env
VITE_SUPABASE_URL=https://sulchsdztjsxnfvkuedc.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

الكود موجه تلقائيا إلى Schema مستقل باسم `customer_management` ولا يستخدم جداول منظور Vault.

## Vercel

- Framework: Vite
- Build command: `npm run build`
- Output: `dist`
