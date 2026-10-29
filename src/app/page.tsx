import Link from 'next/link'
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Database, Globe, CheckCircle2, AlertTriangle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const instant = false

export default async function HomePage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  )

  let user = null
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // Ignored for unconfigured setup
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Teach Easy
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
              >
                <span>مساحة عمل المعلم</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/teacher/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  <span>ابدأ الآن</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Supabase status banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {isSupabaseConfigured ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400">متصل بـ Supabase بنجاح</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-400">
                يرجى ضبط مفاتيح Supabase في ملف .env.local للبدء بالعمل
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
          منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Teach Easy</span> الحديثة
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          مشروع متكامل ومُعد مسبقاً للعمل مع Next.js و Supabase SSR و Tailwind CSS، وجاهز للنشر الفوري والمستمر عبر Vercel و GitHub.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/teacher/dashboard"
            className="touch-target-board px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30 text-lg flex items-center gap-2"
          >
            <span>الدخول إلى مساحة العمل والشاشات التفاعلية</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/alshimaamohamed154-creator/Teach_easy"
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target-board px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition text-base"
          >
            عرض المستودع على GitHub
          </a>
        </div>

        {/* Features / Architecture */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right" dir="rtl">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Next.js App Router</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              أحدث إصدار مع Server Components، أداء فائق وسرعة تحميل استثنائية.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Supabase SSR Ready</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              دعم الـ Authentication وإدارة الجلسات بواسطة Cookies وميدلوير آمن.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Protected Routes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              حماية المسارات الخاصة مثل /dashboard والتوجيه التلقائي للمستخدمين.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Vercel Ready</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              مهيأ للنشر التلقائي فور كل git push مع دعم كامل لمتغيرات البيئة.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>Teach Easy © 2026 — تم البناء والتجهيز بأفضل الممارسات</p>
      </footer>
    </div>
  )
}
