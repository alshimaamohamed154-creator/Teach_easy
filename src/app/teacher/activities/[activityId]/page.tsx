import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ACTIVITIES_MAP } from '@/lib/activities/catalog'
import {
  ArrowRight,
  Clock,
  Users,
  Target,
  Sparkles,
  AlertTriangle,
  FileCheck,
  PlayCircle,
  Layers,
} from 'lucide-react'

export const instant = false

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>
}) {
  const { activityId } = await params
  const activity = ACTIVITIES_MAP.get(activityId)

  if (!activity) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full">
      {/* Back button */}
      <Link
        href="/teacher/activities"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>رجوع لمكتبة الأنشطة</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                {activity.suggestedAge}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                حجم المجموعة: {activity.suggestedGroupSize}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {activity.titleAr}
            </h1>
            <p className="text-slate-400 text-sm font-mono mt-1">{activity.titleEn}</p>
          </div>

          <Link
            href={`/teacher/sessions/new?activityId=${activity.id}`}
            className="touch-target-board px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/20 flex items-center gap-3 transition active:scale-95 shrink-0 cursor-pointer"
          >
            <PlayCircle className="w-6 h-6" />
            <span>جهّز وشغّل النشاط</span>
          </Link>
        </div>

        {/* Pedagogical Rationale */}
        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 mb-8">
          <h2 className="text-base font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            ليه النشاط ده مفيد؟
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {activity.pedagogicalRationaleAr}
          </p>
        </div>

        {/* Materials & Low Resource Alternative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">محتاج تجهّز:</h3>
            <p className="text-xs text-slate-500">{activity.materialsAr}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">لو مفيش شاشة تفاعلية:</h3>
            <p className="text-xs text-slate-500">{activity.lowResourceAlternativeAr}</p>
          </div>
        </div>

        {/* Step Flow Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            خطوات النشاط على الشاشة ({activity.steps.length} خطوات):
          </h2>

          <div className="space-y-3">
            {activity.steps.map((st, idx) => (
              <div
                key={st.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-mono uppercase text-indigo-500 font-bold ml-2">
                      [{st.type}]
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{st.titleAr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Modes & Solutions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            مشاكل ممكن تحصل وحلها:
          </h2>
          <div className="space-y-3">
            {activity.failureModes.map((fm, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-sm"
              >
                <p className="font-bold text-amber-900 dark:text-amber-300">⚠️ المشكلة: {fm.modeAr}</p>
                <p className="text-amber-800 dark:text-amber-400 mt-1">💡 الحل: {fm.solutionAr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
