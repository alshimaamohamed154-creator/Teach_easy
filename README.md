# Teach Easy 🎓

منصة تعليمية حديثة مبنية بأحدث تقنيات الويب: **Next.js (App Router)**، و **TypeScript**، و **Tailwind CSS**، ومتكاملة مع **Supabase** لإدارة قواعد البيانات وتوثيق المستخدمين (Authentication SSR)، ومجهزة بالكامل للنشر الفوري والمستمر عبر **Vercel**.

---

## 🚀 المميزات التقنية (Tech Stack)

- **Framework**: Next.js 16 (Turbopack, Server Actions, App Router)
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (@supabase/ssr & @supabase/supabase-js)
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Version Control**: GitHub

---

## 🛠️ التثبيت والتشغيل محلياً (Local Setup)

1. **استنساخ المستودع (Clone Repo)**:
   ```bash
   git clone https://github.com/alshimaamohamed154-creator/Teach_easy.git
   cd Teach_easy
   ```

2. **تثبيت الحزم (Install Dependencies)**:
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة (Environment Variables)**:
   قم بنسخ ملف `.env.example` إلى `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   ثم افتح `.env.local` وضع بيانات مشروع Supabase الخاص بك:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **تشغيل السيرفر المحلي**:
   ```bash
   npm run dev
   ```
   افتح المتصفح على [http://localhost:3000](http://localhost:3000).

---

## 🔐 إعداد Supabase (Supabase Configuration)

1. أنشئ مشروعاً جديداً على [Supabase](https://supabase.com/).
2. انتقل إلى **Project Settings** > **API**:
   - انسخ `Project URL` وضعه في `NEXT_PUBLIC_SUPABASE_URL`.
   - انسخ `anon public key` وضعه في `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. انتقل إلى **Authentication** > **URL Configuration**:
   - أضف **Site URL**: `http://localhost:3000` (ومستقبلاً رابط Vercel).
   - أضف إلى **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `https://teach-easy.vercel.app/auth/callback` (رابط Vercel الخاص بك).

---

## ☁️ النشر على Vercel (Deploying to Vercel)

1. ادخل على حسابك في [Vercel](https://vercel.com).
2. اضغط **Add New...** ثم **Project**.
3. اختر مستودع GitHub: `Teach_easy`.
4. في قسم **Environment Variables**، أضف المتغيرين التاليين:
   - `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase الخاص بك.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: المفتاح العام (anon key) من Supabase.
5. اضغط **Deploy**.
6. بعد اكتمال النشر، انسخ الدومين الممنوح من Vercel وضعه في قائمة Redirect URLs داخل لوحة تحكم Supabase.

---

## 📁 هيكلية المشروع (Project Structure)

```text
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts  # معالجة كود توثيق الدخول
│   │   └── signout/route.ts   # تسجيل الخروج
│   ├── dashboard/page.tsx     # لوحة تحكم محمية للمستخدمين
│   ├── login/
│   │   ├── actions.ts         # دوال الدخول والتسجيل عبر Server Actions
│   │   └── page.tsx           # واجهة تسجيل الدخول والاشتراك
│   ├── globals.css            # أنماط Tailwind
│   ├── layout.tsx             # الهيكل الأساسي للصفحات
│   └── page.tsx               # الصفحة الرئيسية لمنصة Teach Easy
├── proxy.ts                   # فحص الجلسات وتأمين الروابط (Next.js Proxy)
└── utils/
    └── supabase/              # إعدادات عملاء Supabase (Client, Server, Middleware)
```
