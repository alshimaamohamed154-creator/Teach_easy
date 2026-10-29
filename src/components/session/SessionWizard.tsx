'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClassItem, StudentItem } from '@/lib/dal'
import { ActivityDefinition } from '@/lib/activities/schema'
import { generateStudentGroups, GeneratedGroup } from '@/lib/grouping'
import {
  Users,
  PlayCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Shuffle,
  Scale,
  Settings2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

interface SessionWizardProps {
  initialClasses: ClassItem[]
  allStudents: StudentItem[]
  activities: ActivityDefinition[]
  preselectedClassId?: string
  preselectedActivityId?: string
  createSessionAction: (data: {
    classId: string
    activityId: string
    strategy: 'balanced' | 'random' | 'manual'
    groups: GeneratedGroup[]
  }) => Promise<string>
}

export function SessionWizard({
  initialClasses,
  allStudents,
  activities,
  preselectedClassId,
  preselectedActivityId,
  createSessionAction,
}: SessionWizardProps) {
  const router = useRouter()

  // Selected State
  const [selectedClassId, setSelectedClassId] = useState(
    preselectedClassId || initialClasses[0]?.id || ''
  )
  const [selectedActivityId, setSelectedActivityId] = useState(
    preselectedActivityId || activities[0]?.id || ''
  )
  const [strategy, setStrategy] = useState<'balanced' | 'random' | 'manual'>('balanced')

  // Attendance State (Map studentId -> isPresent)
  const activeClassStudents = allStudents.filter(
    (s) => s.class_id === selectedClassId || selectedClassId === initialClasses[0]?.id
  )

  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    activeClassStudents.forEach((s) => {
      map[s.id] = true
    })
    return map
  })

  // Generated Groups state
  const selectedActivity =
    activities.find((a) => a.id === selectedActivityId) || activities[0]

  // Role templates extracted from selected activity
  const roleBlock = selectedActivity.steps.find((s) => s.type === 'roles')
  const roleTemplates =
    roleBlock && roleBlock.type === 'roles' ? roleBlock.roles : undefined

  // Run grouping
  const groupingStudents = activeClassStudents.map((s, idx) => ({
    id: s.id,
    fullName: s.full_name,
    studentCode: s.student_code,
    isPresent: attendance[s.id] !== false,
    skillScore: (idx % 4) + 1, // sample distributed skill score for balanced algorithm
  }))

  const [groups, setGroups] = useState<GeneratedGroup[]>(() => {
    const res = generateStudentGroups(groupingStudents, {
      strategy,
      targetGroupSize: 4,
      roleTemplates,
    })
    return res.groups
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Re-run grouping on demand or on strategy change
  const handleRegenerateGroups = (newStrategy = strategy) => {
    const res = generateStudentGroups(groupingStudents, {
      strategy: newStrategy,
      targetGroupSize: 4,
      roleTemplates,
      seed: Math.floor(Math.random() * 10000),
    })
    setGroups(res.groups)
  }

  const toggleStudentAttendance = (studentId: string) => {
    const nextAttendance = {
      ...attendance,
      [studentId]: attendance[studentId] === false ? true : false,
    }
    setAttendance(nextAttendance)

    // recalculate
    const updatedGroupingStudents = activeClassStudents.map((s, idx) => ({
      id: s.id,
      fullName: s.full_name,
      studentCode: s.student_code,
      isPresent: nextAttendance[s.id] !== false,
      skillScore: (idx % 4) + 1,
    }))

    const res = generateStudentGroups(updatedGroupingStudents, {
      strategy,
      targetGroupSize: 4,
      roleTemplates,
    })
    setGroups(res.groups)
  }

  const handleLaunchSession = async () => {
    if (groups.length === 0) return
    setIsSubmitting(true)
    try {
      const sessionId = await createSessionAction({
        classId: selectedClassId,
        activityId: selectedActivityId,
        strategy,
        groups,
      })
      router.push(`/teacher/sessions/${sessionId}/board`)
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
    }
  }

  const presentCount = Object.values(attendance).filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* 1. Configuration Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          <span>إعدادات الجلسة والنشاط</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. اختر الفصل الدراسي
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {initialClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              2. استراتيجية النشاط التعاوني
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => {
                setSelectedActivityId(e.target.value)
                handleRegenerateGroups()
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titleAr} ({a.durationMinutes} دقيقة)
                </option>
              ))}
            </select>
          </div>

          {/* Grouping Strategy */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              3. خوارزمية تكوين المجموعات
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStrategy('balanced')
                  handleRegenerateGroups('balanced')
                }}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'balanced'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>متوازن</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStrategy('random')
                  handleRegenerateGroups('random')
                }}
                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  strategy === 'random'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>عشوائي</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Attendance Check & Quick Toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              تسجيل الحضور والغياب السريع ({presentCount} حاضر من {activeClassStudents.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              اضغط على اسم الطالب لاستبعاده إذا كان غائباً وسيعاد توزيع المجموعات فوراً بدون نقص:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {activeClassStudents.map((s) => {
            const isPresent = attendance[s.id] !== false
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleStudentAttendance(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                  isPresent
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-300 dark:border-rose-900 line-through'
                }`}
              >
                {isPresent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span>{s.full_name.split(' ').slice(0, 2).join(' ')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Generated Groups Preview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
              جاهز للإطلاق
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              المجموعات المقترحة ({groups.length} مجموعات)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleRegenerateGroups()}
            className="touch-target-board px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-indigo-500" />
            <span>إعادة توزيع المجموعات</span>
          </button>
        </div>

        {/* Groups Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {groups.map((group) => (
            <div
              key={group.groupNumber}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                  {group.groupName}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold">
                  {group.members.length} طلاب
                </span>
              </div>

              <ul className="space-y-2 text-xs font-medium">
                {group.members.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-700/50"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{m.fullName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {m.roleTitle || `عضو ${idx + 1}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Launch Button */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            disabled={isSubmitting || groups.length === 0}
            onClick={handleLaunchSession}
            className="touch-target-board px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                <span>إطلاق وضع الشاشة التفاعلية للنشاط الآن</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
