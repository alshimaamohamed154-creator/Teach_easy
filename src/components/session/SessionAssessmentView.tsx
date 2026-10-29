'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COMPETENCIES } from '@/lib/competencies'
import {
  CheckCircle2,
  Award,
  Sparkles,
  Save,
  Users,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

interface SessionAssessmentViewProps {
  sessionId: string
  sessionData: {
    className: string
    subject: string
    activityTitle: string
    groups: Array<{
      groupNumber: number
      groupName: string
      members: Array<{ studentId: string; fullName: string; roleTitle?: string }>
    }>
  }
  completeSessionAction: (data: {
    groupRatings: Record<number, number>
    competencyObservations: Record<string, { competencyId: string; level: number; note: string }>
    teacherReflection: string
  }) => Promise<void>
}

export function SessionAssessmentView({
  sessionId,
  sessionData,
  completeSessionAction,
}: SessionAssessmentViewProps) {
  const router = useRouter()

  // State for group ratings (1-4)
  const [groupRatings, setGroupRatings] = useState<Record<number, number>>({})

  // State for student observations: studentId -> { competencyId, level, note }
  const [studentObservations, setStudentObservations] = useState<
    Record<string, { competencyId: string; level: number; note: string }>
  >({})

  const [teacherReflection, setTeacherReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLevelSelect = (studentId: string, competencyId: string, level: number) => {
    setStudentObservations((prev) => ({
      ...prev,
      [studentId]: {
        competencyId,
        level,
        note: prev[studentId]?.note || '',
      },
    }))
  }

  const handleSaveAndComplete = async () => {
    setIsSubmitting(true)
    try {
      await completeSessionAction({
        groupRatings,
        competencyObservations: studentObservations,
        teacherReflection,
      })
      router.push('/teacher/dashboard')
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          مرحلة التقييم الختامي وتدوين الشواهد
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
          تقييم جلسة: {sessionData.activityTitle}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {sessionData.className} • {sessionData.subject} • تقييم سريع ومبني على السلوك الملاحظ
        </p>
      </div>

      {/* 1. Group-level Outcomes Evaluation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>1. تقييم جودة المخرج الجماعي للمجموعات</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          حدد مستوى إنجاز كل مجموعة للمهمة والتزامها بالوقت وتماسك فريقها:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sessionData.groups.map((g) => {
            const currentRating = groupRatings[g.groupNumber] || 3
            return (
              <div
                key={g.groupNumber}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{g.groupName}</h4>
                  <span className="text-xs text-slate-400">{g.members.length} طلاب</span>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setGroupRatings((prev) => ({ ...prev, [g.groupNumber]: level }))
                      }
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition cursor-pointer ${
                        currentRating === level
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Quick Behavioral Observations for Individual Students */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>2. رصد الكفاءات السلوكية الفردية (ملاحظات سريعة)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ليس شرطاً تقييم جميع الطلاب في كل جلسة — سجل فقط الشواهد البارزة التي لاحظتها:
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {sessionData.groups.flatMap((g) =>
            g.members.map((m) => {
              const obs = studentObservations[m.studentId]
              return (
                <div
                  key={m.studentId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.fullName}</h4>
                    <span className="text-xs text-indigo-500 font-semibold">{m.roleTitle || g.groupName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={obs?.competencyId || 'active_listening'}
                      onChange={(e) =>
                        handleLevelSelect(m.studentId, e.target.value, obs?.level || 3)
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {COMPETENCIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.titleAr}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            handleLevelSelect(
                              m.studentId,
                              obs?.competencyId || 'active_listening',
                              lvl
                            )
                          }
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                            obs?.level === lvl
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* 3. Teacher Personal Reflection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>3. تأمل المعلم وتوصية الجلسة القادمة</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          دون ملاحظة سرية خاصة بك لتحسين تفاعل الطلاب في النشاط القادم:
        </p>

        <textarea
          rows={3}
          value={teacherReflection}
          onChange={(e) => setTeacherReflection(e.target.value)}
          placeholder="مثال: تفاعل الطلاب كان ممتازاً مع عداد التفكير الفردي، ولكن مجموعة النسور احتاجت لتشجيع إضافي لتناوب الأدوار..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSaveAndComplete}
          className="touch-target-board px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>حفظ التقييم واعتماد الجلسة والعودة للوحة التحكم</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
