import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getSessionById } from '@/lib/dal'
import { sanitizeToBoardDTO } from '@/lib/dto/board'
import { ClassroomBoardView } from '@/components/board/ClassroomBoardView'

export const instant = false

export default async function BoardPage({
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

  const boardDTO = sanitizeToBoardDTO({
    id: rawSession.id,
    className: rawSession.className || 'الصف الثاني الثانوي',
    subject: rawSession.subject || 'الأحياء',
    activity: rawSession.activity_snapshot,
    currentStepIndex: rawSession.current_step_index,
    status: rawSession.status,
    groups: rawSession.groups || [],
  })

  return <ClassroomBoardView initialSession={boardDTO} />
}
