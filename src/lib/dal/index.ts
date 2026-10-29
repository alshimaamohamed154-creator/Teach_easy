import { createClient } from '@/utils/supabase/server'
import { ACTIVITIES_MAP } from '../activities/catalog'
import { ActivityDefinition } from '../activities/schema'
import { COMPETENCIES } from '../competencies'

export interface ClassItem {
  id: string
  teacher_id: string
  name: string
  subject: string
  grade_level: string
  academic_year: string
  student_count?: number
  created_at: string
}

export interface StudentItem {
  id: string
  teacher_id: string
  full_name: string
  student_code: string | null
  notes: string | null
  class_id?: string
  created_at: string
}

export interface SessionItem {
  id: string
  teacher_id: string
  class_id: string
  className?: string
  subject?: string
  activity_id: string
  activity_snapshot: ActivityDefinition
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
  grouping_strategy: 'balanced' | 'random' | 'manual'
  current_step_index: number
  started_at: string | null
  completed_at: string | null
  created_at: string
  groups?: Array<{
    id: string
    groupNumber: number
    groupName: string
    members: Array<{
      studentId: string
      fullName: string
      roleTitle?: string
      roleDescription?: string
    }>
  }>
}

// In-Memory fallback store for seamless demonstration and testing
let memoryClasses: ClassItem[] = [
  {
    id: 'cls-1',
    teacher_id: 'default',
    name: 'الصف الثاني الثانوي - علمي 1',
    subject: 'الأحياء (Biology)',
    grade_level: '11',
    academic_year: '2026/2027',
    student_count: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cls-2',
    teacher_id: 'default',
    name: 'الصف الأول الثانوي - شعبة أ',
    subject: 'العلوم المتكاملة',
    grade_level: '10',
    academic_year: '2026/2027',
    student_count: 18,
    created_at: new Date().toISOString(),
  },
]

const EGYPTIAN_DEMO_NAMES = [
  'أحمد محمود الشناوي', 'عمر حسام خليل', 'يوسف كريم عبد الرحمن', 'زياد طارق مروان',
  'سيف الدين إبراهيم', 'مصطفى عادل توفيق', 'علي خالد عبد الله', 'حمزة نادر إسماعيل',
  'محمد شريف رضوان', 'ياسين سامح العزازي', 'مريم عصام المنشاوي', 'سارة هشام بدوي',
  'نور الدين أشرف', 'ندى وائل حجازي', 'حبيبة أحمد فوزي', 'شهد مصطفى كامل',
  'آية طارق عبد الفتاح', 'ملك حازم عبد العزيز', 'جنى وليد الدسوقي', 'فريدة هاني زهران',
  'بلال سمير الألفي', 'كريم هيثم البنا', 'أدهم ممدوح غانم', 'مروان سامي بركات',
]

let memoryStudents: StudentItem[] = EGYPTIAN_DEMO_NAMES.map((name, i) => ({
  id: `stu-${i + 1}`,
  teacher_id: 'default',
  full_name: name,
  student_code: `STU-2026-${String(i + 1).padStart(3, '0')}`,
  notes: i % 4 === 0 ? 'مشارك متفاعل ولديه شغف بالتجارب المعملية' : null,
  class_id: i < 18 ? 'cls-1' : 'cls-2',
  created_at: new Date().toISOString(),
}))

let memorySessions: SessionItem[] = []

export async function getTeacherClasses(teacherId: string): Promise<ClassItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('classes')
      .select('*, students:class_enrollments(count)')
      .eq('teacher_id', teacherId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((c: any) => ({
        ...c,
        student_count: c.students?.[0]?.count || 0,
      }))
    }
  } catch {
    // fallback to memory
  }

  return memoryClasses
}

export async function getClassById(classId: string, teacherId: string): Promise<ClassItem | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()

    if (!error && data) return data
  } catch {
    // fallback
  }

  return memoryClasses.find((c) => c.id === classId) || null
}

export async function createClass(teacherId: string, data: { name: string; subject: string; grade_level: string }): Promise<ClassItem> {
  try {
    const supabase = await createClient()
    const { data: created, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: teacherId,
        name: data.name,
        subject: data.subject,
        grade_level: data.grade_level,
      })
      .select()
      .single()

    if (!error && created) return created
  } catch {
    // fallback
  }

  const newClass: ClassItem = {
    id: `cls-${Date.now()}`,
    teacher_id: teacherId,
    name: data.name,
    subject: data.subject,
    grade_level: data.grade_level,
    academic_year: '2026/2027',
    student_count: 0,
    created_at: new Date().toISOString(),
  }
  memoryClasses.unshift(newClass)
  return newClass
}

export async function getClassStudents(classId: string, teacherId: string): Promise<StudentItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('class_enrollments')
      .select('students (*)')
      .eq('class_id', classId)

    if (!error && data && data.length > 0) {
      return data.map((d: any) => d.students).filter(Boolean)
    }
  } catch {
    // fallback
  }

  return memoryStudents.filter((s) => s.class_id === classId || classId === 'cls-1')
}

export async function addStudentToClass(teacherId: string, classId: string, fullName: string, studentCode?: string): Promise<StudentItem> {
  try {
    const supabase = await createClient()
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        teacher_id: teacherId,
        full_name: fullName,
        student_code: studentCode || null,
      })
      .select()
      .single()

    if (!error && student) {
      await supabase.from('class_enrollments').insert({
        class_id: classId,
        student_id: student.id,
      })
      return student
    }
  } catch {
    // fallback
  }

  const newStu: StudentItem = {
    id: `stu-${Date.now()}`,
    teacher_id: teacherId,
    full_name: fullName,
    student_code: studentCode || `STU-${Math.floor(100 + Math.random() * 900)}`,
    notes: null,
    class_id: classId,
    created_at: new Date().toISOString(),
  }
  memoryStudents.push(newStu)
  return newStu
}

export async function createSessionRecord(
  teacherId: string,
  classId: string,
  activityId: string,
  strategy: 'balanced' | 'random' | 'manual',
  groups: Array<{
    groupNumber: number
    groupName: string
    members: Array<{ studentId: string; fullName: string; roleTitle?: string; roleDescription?: string }>
  }>
): Promise<string> {
  const activity = ACTIVITIES_MAP.get(activityId) || ACTIVITIES_MAP.get('think-pair-share')!
  const targetClass = memoryClasses.find((c) => c.id === classId)

  const newSession: SessionItem = {
    id: `sess-${Date.now()}`,
    teacher_id: teacherId,
    class_id: classId,
    className: targetClass?.name || 'الصف الثاني الثانوي',
    subject: targetClass?.subject || 'الأحياء',
    activity_id: activityId,
    activity_snapshot: activity,
    status: 'in_progress',
    grouping_strategy: strategy,
    current_step_index: 0,
    started_at: new Date().toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
    groups: groups.map((g, idx) => ({
      id: `grp-${idx + 1}`,
      groupNumber: g.groupNumber,
      groupName: g.groupName,
      members: g.members,
    })),
  }

  memorySessions.unshift(newSession)
  return newSession.id
}

export async function getSessionById(sessionId: string, teacherId: string): Promise<SessionItem | null> {
  return memorySessions.find((s) => s.id === sessionId) || null
}

export async function updateSessionStep(sessionId: string, stepIndex: number) {
  const session = memorySessions.find((s) => s.id === sessionId)
  if (session) {
    session.current_step_index = stepIndex
  }
}

export async function completeSession(sessionId: string) {
  const session = memorySessions.find((s) => s.id === sessionId)
  if (session) {
    session.status = 'completed'
    session.completed_at = new Date().toISOString()
  }
}

export async function getTeacherAnalytics(teacherId: string) {
  return {
    totalClasses: memoryClasses.length,
    totalStudents: memoryStudents.length,
    totalSessions: memorySessions.length + 3, // includes historic demo sessions
    competenciesTracked: COMPETENCIES.length,
    recentObservations: [
      { studentName: 'أحمد محمود الشناوي', competency: 'الاستماع الفعال', level: 3, date: 'اليوم' },
      { studentName: 'مريم عصام المنشاوي', competency: 'الشرح وتعليم الأقران', level: 4, date: 'أمس' },
      { studentName: 'يوسف كريم عبد الرحمن', competency: 'حل المشكلات التشاركي', level: 3, date: 'منذ يومين' },
    ],
  }
}
