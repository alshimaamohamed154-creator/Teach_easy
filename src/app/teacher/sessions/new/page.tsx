import { createClient } from '@/utils/supabase/server'
import { getTeacherClasses, getClassStudents, createSessionRecord } from '@/lib/dal'
import { ACTIVITIES_CATALOG } from '@/lib/activities/catalog'
import { SessionWizard } from '@/components/session/SessionWizard'

export const instant = false

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; activityId?: string }>
}) {
  const { classId, activityId } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const teacherId = user?.id || 'default'
  const classes = await getTeacherClasses(teacherId)
  const defaultClassId = classId || classes[0]?.id || 'cls-1'
  const allStudents = await getClassStudents(defaultClassId, teacherId)

  async function handleCreateSession(data: {
    classId: string
    activityId: string
    strategy: 'balanced' | 'random' | 'manual'
    groups: any[]
  }) {
    'use server'
    const newSessionId = await createSessionRecord(
      teacherId,
      data.classId,
      data.activityId,
      data.strategy,
      data.groups
    )
    return newSessionId
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          جهّز حصتك التفاعلية
        </h1>
        <p className="text-slate-500 mt-1">
          اختار الفصل والنشاط، شوف المجموعات، وبعدين شغّل الشاشة قدام الطلاب على طول.
        </p>
      </div>

      <SessionWizard
        initialClasses={classes}
        allStudents={allStudents}
        activities={ACTIVITIES_CATALOG}
        preselectedClassId={classId}
        preselectedActivityId={activityId}
        createSessionAction={handleCreateSession}
      />
    </div>
  )
}
