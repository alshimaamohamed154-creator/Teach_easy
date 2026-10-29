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
  notes: i % 4 === 0 ? 'متفاعل جدًا وبيحب التجارب العملية' : null,
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

  // بنحاول نحفظ الجلسة في Supabase عشان تفضل موجودة حتى لو سيرفرلس حصل له cold start تاني
  try {
    const supabase = await createClient()
    const { data: sessionRow, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        teacher_id: teacherId,
        class_id: classId,
        activity_id: activityId,
        activity_snapshot: activity,
        status: 'in_progress',
        grouping_strategy: strategy,
        current_step_index: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (sessionError || !sessionRow) throw sessionError || new Error('session insert failed')

    for (const g of groups) {
      const { data: groupRow, error: groupError } = await supabase
        .from('session_groups')
        .insert({ session_id: sessionRow.id, group_number: g.groupNumber, group_name: g.groupName })
        .select()
        .single()

      if (groupError || !groupRow) throw groupError || new Error('group insert failed')
      if (g.members.length === 0) continue

      const { data: participantRows, error: participantError } = await supabase
        .from('session_participants')
        .insert(g.members.map((m) => ({ session_id: sessionRow.id, student_id: m.studentId, is_present: true })))
        .select()

      if (participantError || !participantRows) throw participantError || new Error('participant insert failed')

      const { error: memberError } = await supabase.from('session_group_members').insert(
        g.members.map((m, idx) => ({
          group_id: groupRow.id,
          participant_id: participantRows[idx].id,
          role_title: m.roleTitle || null,
          role_description: m.roleDescription || null,
        }))
      )
      if (memberError) throw memberError
    }

    return sessionRow.id
  } catch {
    // fallback للذاكرة لو Supabase مش متاح أو البيانات تجريبية
  }

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
  try {
    const supabase = await createClient()
    const { data: sessionRow, error } = await supabase
      .from('sessions')
      .select('*, classes(name, subject)')
      .eq('id', sessionId)
      .eq('teacher_id', teacherId)
      .single()

    if (error || !sessionRow) throw error || new Error('session not found')

    const { data: groupRows } = await supabase
      .from('session_groups')
      .select(
        'id, group_number, group_name, session_group_members(id, role_title, role_description, session_participants(student_id, students(full_name)))'
      )
      .eq('session_id', sessionId)
      .order('group_number')

    const groups = (groupRows || []).map((g: any) => ({
      id: g.id,
      groupNumber: g.group_number,
      groupName: g.group_name,
      members: (g.session_group_members || []).map((gm: any) => ({
        studentId: gm.session_participants?.student_id,
        fullName: gm.session_participants?.students?.full_name || 'طالب',
        roleTitle: gm.role_title || undefined,
        roleDescription: gm.role_description || undefined,
      })),
    }))

    return {
      id: sessionRow.id,
      teacher_id: sessionRow.teacher_id,
      class_id: sessionRow.class_id,
      className: sessionRow.classes?.name || 'الصف الثاني الثانوي',
      subject: sessionRow.classes?.subject || 'الأحياء',
      activity_id: sessionRow.activity_id,
      activity_snapshot: sessionRow.activity_snapshot,
      status: sessionRow.status,
      grouping_strategy: sessionRow.grouping_strategy,
      current_step_index: sessionRow.current_step_index,
      started_at: sessionRow.started_at,
      completed_at: sessionRow.completed_at,
      created_at: sessionRow.created_at,
      groups,
    }
  } catch {
    // fallback للذاكرة
  }

  return memorySessions.find((s) => s.id === sessionId) || null
}

export async function updateSessionStep(sessionId: string, stepIndex: number) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('sessions')
      .update({ current_step_index: stepIndex })
      .eq('id', sessionId)
    if (error) throw error
    return
  } catch {
    // fallback للذاكرة
  }

  const session = memorySessions.find((s) => s.id === sessionId)
  if (session) {
    session.current_step_index = stepIndex
  }
}

export interface SessionAssessmentPayload {
  groupRatings: Record<number, number>
  competencyObservations: Record<string, { competencyId: string; level: number; note: string }>
  teacherReflection: string
}

export async function completeSession(sessionId: string, assessment?: SessionAssessmentPayload) {
  try {
    const supabase = await createClient()
    const { data: sessionRow, error: updateError } = await supabase
      .from('sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single()

    if (updateError || !sessionRow) throw updateError || new Error('session not found')

    if (assessment) {
      const { data: groupRows } = await supabase
        .from('session_groups')
        .select('id, group_number')
        .eq('session_id', sessionId)
      const groupIdByNumber = new Map((groupRows || []).map((g: any) => [g.group_number, g.id]))

      const assessmentRows = Object.entries(assessment.groupRatings).map(([groupNumber, rating]) => ({
        session_id: sessionId,
        group_id: groupIdByNumber.get(Number(groupNumber)) || null,
        collaboration_quality: rating,
        teacher_reflection: assessment.teacherReflection || null,
      }))

      if (assessmentRows.length > 0) {
        await supabase.from('session_assessments').insert(assessmentRows)
      } else if (assessment.teacherReflection) {
        await supabase
          .from('session_assessments')
          .insert({ session_id: sessionId, teacher_reflection: assessment.teacherReflection })
      }

      const obsEntries = Object.entries(assessment.competencyObservations)
      if (obsEntries.length > 0) {
        await supabase.from('student_competency_observations').insert(
          obsEntries.map(([studentId, obs]) => ({
            teacher_id: sessionRow.teacher_id,
            student_id: studentId,
            session_id: sessionId,
            competency_id: obs.competencyId,
            level: obs.level,
            evidence_note: obs.note || null,
          }))
        )
      }
    }

    return
  } catch {
    // fallback للذاكرة
  }

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
    totalSessions: memorySessions.length + 3, // بيانات تجريبية لحصص سابقة
    competenciesTracked: COMPETENCIES.length,
    recentObservations: [
      { studentName: 'أحمد محمود الشناوي', competency: 'الاستماع الكويس', level: 3, date: 'النهاردة' },
      { studentName: 'مريم عصام المنشاوي', competency: 'الشرح وتعليم زمايله', level: 4, date: 'امبارح' },
      { studentName: 'يوسف كريم عبد الرحمن', competency: 'حل المشاكل مع بعض', level: 3, date: 'من يومين' },
    ],
  }
}
