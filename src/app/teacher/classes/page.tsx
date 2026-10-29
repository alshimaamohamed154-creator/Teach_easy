import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getTeacherClasses, createClass } from '@/lib/dal'
import { Users2, Plus, ArrowLeft, GraduationCap, BookOpen } from 'lucide-react'

export const instant = false

export default async function ClassesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const teacherId = user?.id || 'default'
  const classes = await getTeacherClasses(teacherId)

  async function handleCreateClass(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const gradeLevel = formData.get('gradeLevel') as string

    if (name && subject) {
      await createClass(teacherId, {
        name,
        subject,
        grade_level: gradeLevel || '11',
      })
      revalidatePath('/teacher/classes')
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">الفصول</h1>
          <p className="text-slate-500 mt-1">هنا تدير فصولك وقوايم طلابك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                    الصف {c.grade_level} الثانوي
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{c.academic_year}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{c.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  {c.subject}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {c.student_count || 24} طالب مسجّل
                </span>
                <Link
                  href={`/teacher/classes/${c.id}`}
                  className="touch-target-board px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1"
                >
                  <span>شوف القائمة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add Class Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">ضيف فصل جديد</h2>
              <p className="text-xs text-slate-500">اعمل فصل أو شعبة جديدة</p>
            </div>
          </div>

          <form action={handleCreateClass} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم الفصل أو الشعبة
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="مثال: الصف الثاني الثانوي - علمي 2"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                المادة
              </label>
              <input
                name="subject"
                type="text"
                required
                placeholder="مثال: فيزياء أو كيمياء"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الصف الدراسي
              </label>
              <select
                name="gradeLevel"
                defaultValue="11"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="10">الصف الأول الثانوي</option>
                <option value="11">الصف الثاني الثانوي</option>
                <option value="12">الصف الثالث الثانوي</option>
              </select>
            </div>

            <button
              type="submit"
              className="touch-target-board w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer mt-4"
            >
              حفظ الفصل
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
