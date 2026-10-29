import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getSessionById, completeSession } from '@/lib/dal'
import { SessionAssessmentView } from '@/components/session/SessionAssessmentView'

export const instant = false

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rawSession = await getSessionById(sessionId, user?.id || 'default')
  if (!rawSession) {
    notFound()
  }

  async function handleCompleteSession(data: {
    groupRatings: Record<number, number>
    competencyObservations: Record<string, { competencyId: string; level: number; note: string }>
    teacherReflection: string
  }) {
    'use server'
    await completeSession(sessionId, data)
  }

  return (
    <SessionAssessmentView
      sessionId={sessionId}
      sessionData={{
        className: rawSession.className || 'الصف الثاني الثانوي',
        subject: rawSession.subject || 'الأحياء',
        activityTitle: rawSession.activity_snapshot.titleAr,
        groups: (rawSession.groups || []).map((g) => ({
          groupNumber: g.groupNumber,
          groupName: g.groupName,
          members: g.members.map((m) => ({
            studentId: m.studentId,
            fullName: m.fullName,
            roleTitle: m.roleTitle,
          })),
        })),
      }}
      completeSessionAction={handleCompleteSession}
    />
  )
}
