# دليل الإطلاق والرفع على الحساب الرئيسي — SAKAN Production Launch Guide

هذا الدليل يوضح لك بالخطوات الدقيقة كيفية رفع تطبيق **سَكَن (SAKAN)** كاملاً أونلاين على حساباتك الرئيسية الرسمية:
1. **GitHub** (لحفظ وإدارة الكود المصدري)
2. **Supabase** (لقاعدة البيانات السحابية والصور والأمان)
3. **Vercel** (لاستضافة وتشغيل الموقع برابط مباشر وسريع للجمهور)

---

## الخطوة الأولى: رفع الكود على حسابك في GitHub

المشروع جاهز ومُرتّب بالكامل على الفرع الرئيسي `main`.

### الطريقة السريعة عبر سطر الأوامر (Terminal):
إذا كان لديك أداة `gh` (GitHub CLI) مثبتة، افتح التيرمينال في مجلد المشروع ونفّذ:
```bash
# تسجيل الدخول لحسابك على GitHub
gh auth login

# إنشاء المستودع ورفع الكود مباشرة
gh repo create sakan --public --source=. --remote=origin --push
```

### أو الطريقة اليدوية عبر موقع GitHub:
1. افتح [github.com/new](https://github.com/new) وأنشئ مستودعاً جديداً باسم `sakan`.
2. في مجلد المشروع على جهازك، نفّذ الأمرين التاليين (مع استبدال `YOUR_USERNAME` باسم حسابك):
```bash
git remote add origin https://github.com/YOUR_USERNAME/sakan.git
git push -u origin main
```

---

## الخطوة الثانية: تجهيز قاعدة البيانات على حسابك في Supabase

1. ادخل على حسابك في [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً (New Project) باسم **SAKAN**.
2. اختر كلمة سر قوية لقاعدة البيانات ومنطقة الخادم الأقرب لمصر (مثل **Frankfurt / eu-central-1**).
3. بعد اكتمال إنشاء المشروع، توجه إلى قائمة **SQL Editor** من الشريط الجانبي.
4. افتح الملف المجهز لك خصيصاً في المشروع:
   `supabase/000_FULL_PRODUCTION_SCHEMA.sql`
5. انسخ محتواه بالكامل والصقه في الـ SQL Editor واضغط **Run**.
   - سيقوم هذا الأمر تلقائياً بإنشاء:
     - كافة الجداول الـ ١٧ (Profiles, Listings, Complaints, Wanted Requests, Audit Logs, إلخ).
     - سياسات الأمان والحماية الصارمة (Row Level Security).
     - مجلدات تخزين الصور والملفات ومرفقات البلاغات (Storage Buckets).
6. توجه إلى **Project Settings** -> **API** وانسخ القيم التالية:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (سري خاص بالسيرفر فقط)

---

## الخطوة الثالثة: النشر المباشر على Vercel (أو منصة الاستضافة)

1. ادخل على حسابك في [vercel.com](https://vercel.com) واضغط **Add New...** -> **Project**.
2. ستجد مستودع **sakan** الذي رفعته للتو على GitHub، اضغط أمامه على **Import**.
3. في قسم **Environment Variables** (المتغيرات البيئية)، أضف المتغيرات التالية بالقيم التي نسختها من Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL الخاص بمشروعك)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key الخاص بمشروعك)
   - `SUPABASE_SERVICE_ROLE_KEY` = (service_role key الخاص بمشروعك)
   - `NEXT_PUBLIC_APP_URL` = (رابط موقعك على فيرسيل، مثلاً `https://sakan.vercel.app`)
4. اضغط على زر **Deploy**.

خلال دقيقة إلى دقيقتين، سيتم بناء التطبيق بنجاح وسيكون موقعك حياً ومتاحاً للعالم برابط رسمي سريع ومجاني!

---

## الخطوة الرابعة: تعيين نفسك كـ Super Admin في قاعدة البيانات

بعد نشر الموقع، افتح الرابط واشترك بحسابك الشخصي عبر `/signup`.
ثم في الـ SQL Editor في Supabase، نفّذ الاستعلام التالي لمنح حسابك كافة الصلاحيات:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'
FROM public.profiles
WHERE phone = '+2010XXXXXXXX' -- ضع رقم هاتفك المسجل به
ON CONFLICT (user_id, role) DO NOTHING;
```
الآن يمكنك الدخول فوراً إلى:
`https://your-domain.vercel.app/admin/sheet`
للتحكم الكامل وإدارة المنصة!
