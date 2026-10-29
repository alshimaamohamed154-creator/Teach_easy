import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
  GraduationCap,
  LayoutDashboard,
  Users2,
  BookOpen,
  PlusCircle,
  History,
  LogOut,
} from 'lucide-react'

export const instant = false

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar (RTL Right side) */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Teach Easy
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-semibold">
            <Link
              href="/teacher/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة التحكم</span>
            </Link>

            <Link
              href="/teacher/classes"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <Users2 className="w-5 h-5" />
              <span>الفصول والطلاب</span>
            </Link>

            <Link
              href="/teacher/activities"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <BookOpen className="w-5 h-5" />
              <span>مكتبة الأنشطة</span>
            </Link>

            <Link
              href="/teacher/sessions/new"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm font-bold mt-4"
            >
              <PlusCircle className="w-5 h-5" />
              <span>بدء جلسة جديدة</span>
            </Link>
          </nav>
        </div>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.user_metadata?.full_name || 'الأستاذ المعلم'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'معلم معتمد'}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                title="تسجيل الخروج"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
