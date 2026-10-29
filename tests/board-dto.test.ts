import { describe, it, expect } from 'vitest'
import { sanitizeToBoardDTO } from '../src/lib/dto/board'
import { ACTIVITIES_CATALOG } from '../src/lib/activities/catalog'

describe('Board DTO Sanitizer Security & Privacy Tests', () => {
  it('purges confidential notes, competency levels, and academic weakness from board payload', () => {
    const rawSession = {
      id: 'sess-123',
      className: '2/1 علمي',
      subject: 'أحياء',
      activity: ACTIVITIES_CATALOG[0],
      currentStepIndex: 1,
      status: 'in_progress' as const,
      groups: [
        {
          id: 'grp-1',
          groupNumber: 1,
          groupName: 'مجموعة الصقور',
          members: [
            {
              studentId: 'stu-1',
              fullName: 'أحمد محمود',
              roleTitle: 'الميسر',
              roleDescription: 'إدارة الوقت',
              notes: 'طالب يعاني من بطء في استيعاب المفاهيم الرياضية (سري للغاية)',
              competencyScores: { active_listening: 1 },
              academicGrade: 'D',
            },
          ],
        },
      ],
    }

    const safeDTO = sanitizeToBoardDTO(rawSession)

    // Verify allowed fields exist
    expect(safeDTO.id).toBe('sess-123')
    expect(safeDTO.className).toBe('2/1 علمي')
    expect(safeDTO.groups[0].members[0].fullName).toBe('أحمد محمود')
    expect(safeDTO.groups[0].members[0].roleTitle).toBe('الميسر')

    // Verify sensitive fields are physically stripped
    const memberJson = JSON.stringify(safeDTO.groups[0].members[0])
    expect(memberJson).not.toContain('سري للغاية')
    expect(memberJson).not.toContain('competencyScores')
    expect(memberJson).not.toContain('academicGrade')
    expect((safeDTO.groups[0].members[0] as any).notes).toBeUndefined()
    expect((safeDTO.groups[0].members[0] as any).competencyScores).toBeUndefined()
    expect((safeDTO.groups[0].members[0] as any).academicGrade).toBeUndefined()
  })
})
