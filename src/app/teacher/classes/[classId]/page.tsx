import Link from 'next/link'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getClassById, getClassStudents, addStudentToClass } from '@/lib/dal'
import {
  Users2,
  UserPlus,
  PlayCircle,
  FileSpreadsheet,
  ArrowRight,
  Search,
  BookOpen,
} from 'lucide-react'

export const instant = false

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const teacherId = user?.id || 'default'
  const targetClass = await getClassById(classId, teacherId)

  if (!targetClass) {
    notFound()
  }

  const students = await getClassStudents(classId, teacherId)

  async function handleAddStudent(formData: FormData) {
    'use server'
    const fullName = formData.get('fullName') as string
    const studentCode = formData.get('studentCode') as string

    if (fullName) {
      await addStudentToClass(teacherId, classId, fullName, studentCode)
      revalidatePath(`/teacher/classes/${classId}`)
    }
  }

  async function handleBatchImport(formData: FormData) {
    'use server'
    const csvContent = formData.get('csvContent') as string
    if (csvContent) {
      const lines = csvContent.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed) {
          const parts = trimmed.split(',')
          const name = parts[0]?.trim()
          const code = parts[1]?.trim()
          if (name) {
            await addStudentToClass(teacherId, classId, name, code)
          }
        }
      }
      revalidatePath(`/teacher/classes/${classId}`)
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      {/* Back button */}
      <Link
        href="/teacher/classes"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>رجوع لقائمة الفصول</span>
      </Link>

      {/* Class Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              الصف {targetClass.grade_level} الثانوي
            </span>
            <span className="text-xs font-semibold text-slate-400">{targetClass.academic_year}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{targetClass.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm font-medium">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            {targetClass.subject} • {students.length} طالب في القائمة
          </p>
        </div>

        <Link
          href={`/teacher/sessions/new?classId=${targetClass.id}`}
          className="touch-target-board px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition active:scale-95 shrink-0 cursor-pointer"
        >
          <PlayCircle className="w-5 h-5" />
          <span>ابدأ نشاط لهذا الفصل</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Roster Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">طلاب الفصل</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {students.length} طالب
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="pb-3 pr-2">#</th>
                  <th className="pb-3">اسم الطالب</th>
                  <th className="pb-3">الكود</th>
                  <th className="pb-3">ملاحظاتك</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 pr-2 text-slate-400 text-xs font-mono">{idx + 1}</td>
                    <td className="py-3.5 text-slate-900 dark:text-white font-bold">{s.full_name}</td>
                    <td className="py-3.5 font-mono text-xs text-slate-500">{s.student_code || '—'}</td>
                    <td className="py-3.5 text-xs text-slate-400 max-w-[180px] truncate">
                      {s.notes || <span className="text-slate-300 dark:text-slate-600">مفيش ملاحظات</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Student & Batch Import Sidebar */}
        <div className="space-y-6">
          {/* Quick Add Single Student */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span>ضيف طالب</span>
            </h3>

            <form action={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  الاسم بالكامل
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="محمد أحمد إبراهيم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  كود الطالب (اختياري)
                </label>
                <input
                  name="studentCode"
                  type="text"
                  placeholder="STU-2026-035"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="touch-target-board w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer mt-2"
              >
                ضيف الطالب
              </button>
            </form>
          </div>

          {/* Batch CSV Import */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>ضيف طلاب كتير مرة واحدة</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-normal">
              الصق أسماء الطلاب سطر تحت سطر (الاسم، وبعده الكود لو موجود):
            </p>

            <form action={handleBatchImport} className="space-y-3">
              <textarea
                name="csvContent"
                rows={4}
                placeholder="خالد حسني البحيري, STU-2026-031&#10;ريم عصام زهران, STU-2026-032"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                className="touch-target-board w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                ضيف القائمة كلها
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
