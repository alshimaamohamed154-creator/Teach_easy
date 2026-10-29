import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { GraduationCap, User, Mail, ShieldCheck, Database, LogOut, CheckCircle2, ArrowRight } from 'lucide-react'

export const instant = false

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Teach Easy</span>
          </Link>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-850 text-sm font-medium transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              لوحة التحكم
            </span>
            <h1 className="text-3xl font-extrabold mt-4 mb-2">
              أهلاً بك، {user.user_metadata?.full_name || user.email?.split('@')[0]} 👋
            </h1>
            <p className="text-indigo-100 max-w-xl text-sm sm:text-base">
              تم تسجيل دخولك بنجاح. يمكنك الآن الانتقال لمساحة عمل المعلم لإدارة الفصول وإطلاق الأنشطة على الشاشات التفاعلية.
            </p>
          </div>

          <Link
            href="/teacher/dashboard"
            className="touch-target-board px-6 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <span>مساحة عمل المعلم والفصول</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg">بيانات الحساب</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> البريد الإلكتروني:
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> معرّف المستخدم (UID):
                </span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">حالة التحقق:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل
                </span>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg">حالة خدمات المشروع</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium">Supabase Auth & Database</p>
                  <p className="text-xs text-slate-500">متصل وجاهز للاستعلامات</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium">Vercel Deployment Ready</p>
                  <p className="text-xs text-slate-500">جاهز للنشر التلقائي عبر GitHub</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  Configured
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
