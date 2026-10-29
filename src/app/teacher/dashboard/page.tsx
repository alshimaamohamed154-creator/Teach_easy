import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { getTeacherAnalytics, getTeacherClasses } from '@/lib/dal'
import {
  Users2,
  BookOpen,
  PlayCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Database,
} from 'lucide-react'

export const instant = false

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const teacherId = user?.id || 'default'
  const analytics = await getTeacherAnalytics(teacherId)
  const classes = await getTeacherClasses(teacherId)

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            التعلم الجماعي على الشاشة التفاعلية
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-2">
            أهلاً بيك، {user?.user_metadata?.full_name || 'أستاذنا'} 👋
          </h1>
          <p className="text-indigo-100 max-w-xl text-sm sm:text-base leading-relaxed">
            جاهز لحصة تفاعلية حلوة النهاردة؟ اختار الفصل والنشاط وشغّل الشاشة بدوسة واحدة.
          </p>
        </div>

        <Link
          href="/teacher/sessions/new"
          className="touch-target-board px-8 py-4 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-base shadow-xl flex items-center gap-3 transition-all active:scale-95 shrink-0"
        >
          <PlayCircle className="w-6 h-6 text-indigo-600" />
          <span>ابدأ حصة جديدة دلوقتي</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">فصولك</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalClasses}</p>
          <span className="text-xs text-slate-400 mt-1 block">فصل مسجّل</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">عدد الطلاب</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalStudents}</p>
          <span className="text-xs text-slate-400 mt-1 block">طالب في القوايم</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">الحصص اللي خلصت</span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalSessions}</p>
          <span className="text-xs text-slate-400 mt-1 block">حصة تفاعلية</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">المهارات بتتابعها</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">8</p>
          <span className="text-xs text-slate-400 mt-1 block">مهارات جماعية</span>
        </div>
      </div>

      {/* Grid: Classes & Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">فصولك</h2>
              <p className="text-sm text-slate-500">اختار فصل عشان تدير طلابه وحضورهم</p>
            </div>
            <Link
              href="/teacher/classes"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              <span>كل الفصول</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((c) => (
              <Link
                key={c.id}
                href={`/teacher/classes/${c.id}`}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-400 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                    الصف {c.grade_level} الثانوي
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 transition">
                    {c.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{c.subject}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/40 flex justify-between text-xs font-semibold text-slate-500">
                  <span>{c.student_count || 24} طالب</span>
                  <span>{c.academic_year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Observations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">آخر الملاحظات</h2>
            <p className="text-sm text-slate-500 mb-6">تطور مهارات الطلاب وهم بيشتغلوا مع بعض</p>

            <div className="space-y-4">
              {analytics.recentObservations.map((obs, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{obs.studentName}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{obs.competency}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      مستوى {obs.level}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">{obs.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center">
            التقييم ده بناءً على اللي شوفته بس، مش حكم نهائي على الطالب.
          </div>
        </div>
      </div>
    </div>
  )
}
