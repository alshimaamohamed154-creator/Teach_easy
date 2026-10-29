import Link from 'next/link'
import { ACTIVITIES_CATALOG } from '@/lib/activities/catalog'
import { COMPETENCIES } from '@/lib/competencies'
import {
  BookOpen,
  Clock,
  Users,
  Sparkles,
  ArrowLeft,
  Search,
  CheckCircle2,
} from 'lucide-react'

export const instant = false

export default function ActivitiesPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 text-center sm:text-right">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          أنشطة جاهزة ومجرّبة
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
          مكتبة الأنشطة
        </h1>
        <p className="text-slate-500 max-w-2xl mt-2 text-base">
          ٨ أنشطة جاهزة من غير تعقيد، اتعملت خصوصي للفصول المصرية الثانوية وتشتغل من أول دوسة.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACTIVITIES_CATALOG.map((act) => {
          return (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {act.category === 'discussion'
                      ? 'نقاش'
                      : act.category === 'problem_solving'
                      ? 'حل مشكلة'
                      : act.category === 'peer_instruction'
                      ? 'تعليم الأقران'
                      : act.category === 'jigsaw'
                      ? 'مجموعات خبراء'
                      : act.category === 'classification'
                      ? 'تصنيف وترتيب'
                      : 'تقييم زملاء'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{act.durationMinutes} دقيقة</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition">
                  {act.titleAr}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {act.pedagogicalRationaleAr}
                </p>

                {/* Target Competencies Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {act.targetCompetencies.map((comp) => (
                    <span
                      key={comp}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40"
                    >
                      {comp === 'active_listening'
                        ? 'الاستماع الكويس'
                        : comp === 'clear_explanation'
                        ? 'الشرح للزملاء'
                        : comp === 'constructive_disagreement'
                        ? 'الاختلاف بأدب'
                        : comp === 'shared_responsibility'
                        ? 'الالتزام بالدور'
                        : comp === 'problem_solving'
                        ? 'حل المشاكل'
                        : 'تقييم الزملاء'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href={`/teacher/activities/${act.id}`}
                  className="touch-target-board px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>تفاصيل النشاط</span>
                </Link>

                <Link
                  href={`/teacher/sessions/new?activityId=${act.id}`}
                  className="touch-target-board px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <span>شغّله في الفصل</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
