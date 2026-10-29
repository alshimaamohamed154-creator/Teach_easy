import { ActivityDefinition } from '../activities/schema'

export interface BoardStudentDTO {
  id: string
  fullName: string
  roleTitle?: string
  roleDescription?: string
}

export interface BoardGroupDTO {
  id: string
  groupNumber: number
  groupName: string
  members: BoardStudentDTO[]
}

export interface BoardSessionDTO {
  id: string
  className: string
  subject: string
  activity: ActivityDefinition
  currentStepIndex: number
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
  groups: BoardGroupDTO[]
  totalAttendees: number
}

/**
 * Sanitizes raw database session records into a strictly board-safe DTO.
 * Guarantees that private teacher notes, competency rubrics, past evaluations,
 * and academic rankings are completely purged before the payload reaches the client.
 */
export function sanitizeToBoardDTO(rawSession: {
  id: string
  className: string
  subject: string
  activity: ActivityDefinition
  currentStepIndex: number
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
  groups: Array<{
    id: string
    groupNumber: number
    groupName: string
    members: Array<{
      studentId: string
      fullName: string
      roleTitle?: string | null
      roleDescription?: string | null
      // Sensitive fields that must be purged:
      notes?: any
      competencyScores?: any
      academicGrade?: any
    }>
  }>
}): BoardSessionDTO {
  let totalAttendees = 0

  const safeGroups: BoardGroupDTO[] = (rawSession.groups || []).map((g) => {
    const safeMembers: BoardStudentDTO[] = (g.members || []).map((m) => {
      totalAttendees++
      return {
        id: m.studentId,
        fullName: m.fullName,
        roleTitle: m.roleTitle || undefined,
        roleDescription: m.roleDescription || undefined,
      }
    })

    return {
      id: g.id,
      groupNumber: g.groupNumber,
      groupName: g.groupName,
      members: safeMembers,
    }
  })

  return {
    id: rawSession.id,
    className: rawSession.className,
    subject: rawSession.subject,
    activity: rawSession.activity,
    currentStepIndex: rawSession.currentStepIndex || 0,
    status: rawSession.status,
    groups: safeGroups,
    totalAttendees,
  }
}
