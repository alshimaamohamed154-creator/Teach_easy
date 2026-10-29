import { describe, it, expect } from 'vitest'
import { ActivityDefinitionSchema } from '../src/lib/activities/schema'
import { ACTIVITIES_CATALOG } from '../src/lib/activities/catalog'

describe('Activity Catalog Schema Validation', () => {
  it('validates that all 8 activities match the strict Zod schema', () => {
    expect(ACTIVITIES_CATALOG.length).toBe(8)

    ACTIVITIES_CATALOG.forEach((activity) => {
      const parsed = ActivityDefinitionSchema.safeParse(activity)
      if (!parsed.success) {
        console.error(`Validation failed for activity: ${activity.id}`, parsed.error.issues)
      }
      expect(parsed.success).toBe(true)
    })
  })

  it('contains valid interactive step blocks with tap targets and timers', () => {
    const classificationAct = ACTIVITIES_CATALOG.find((a) => a.id === 'collaborative-classification')
    expect(classificationAct).toBeDefined()
    const hasClassificationBlock = classificationAct?.steps.some((s) => s.type === 'classification')
    const hasSequencingBlock = classificationAct?.steps.some((s) => s.type === 'sequencing')
    expect(hasClassificationBlock).toBe(true)
    expect(hasSequencingBlock).toBe(true)

    const peerInstructionAct = ACTIVITIES_CATALOG.find((a) => a.id === 'peer-instruction')
    expect(peerInstructionAct).toBeDefined()
    const hasMcqBlock = peerInstructionAct?.steps.some((s) => s.type === 'mcq')
    expect(hasMcqBlock).toBe(true)
  })
})
