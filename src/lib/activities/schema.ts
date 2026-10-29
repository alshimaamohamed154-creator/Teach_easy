import { z } from 'zod'

// Block Schemas
export const BaseStepBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'intro',
    'instructions',
    'timer',
    'roles',
    'reveal',
    'mcq',
    'classification',
    'sequencing',
    'group_response',
    'reflection',
    'check',
  ]),
  titleAr: z.string(),
  titleEn: z.string().optional(),
  descriptionAr: z.string().optional(),
})

export const IntroBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('intro'),
  objectives: z.array(z.string()),
  realWorldContextAr: z.string(),
  estimatedMinutes: z.number().default(5),
})

export const InstructionsBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('instructions'),
  steps: z.array(z.object({
    order: z.number(),
    title: z.string(),
    detail: z.string(),
    icon: z.string().optional(),
  })),
  teacherTipAr: z.string().optional(),
})

export const TimerBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('timer'),
  durationSeconds: z.number().min(10),
  timerMode: z.enum(['individual_thinking', 'group_discussion', 'peer_defense', 'writing']),
  promptAr: z.string(),
  guidelines: z.array(z.string()).optional(),
})

export const RolesBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('roles'),
  roles: z.array(z.object({
    id: z.string(),
    titleAr: z.string(),
    descriptionAr: z.string(),
    responsibilityAr: z.string(),
  })),
})

export const RevealBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('reveal'),
  teaserAr: z.string(),
  revealedContentAr: z.string(),
  explanationAr: z.string().optional(),
})

export const McqBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('mcq'),
  questionAr: z.string(),
  options: z.array(z.object({
    id: z.string(),
    textAr: z.string(),
    isCorrect: z.boolean().optional(),
    explanationAr: z.string().optional(),
  })),
  allowPeerDebate: z.boolean().default(true),
})

export const ClassificationBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('classification'),
  instructionsAr: z.string(),
  buckets: z.array(z.object({
    id: z.string(),
    titleAr: z.string(),
    colorTheme: z.string().optional(),
  })),
  items: z.array(z.object({
    id: z.string(),
    textAr: z.string(),
    correctBucketId: z.string().optional(),
  })),
})

export const SequencingBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('sequencing'),
  instructionsAr: z.string(),
  items: z.array(z.object({
    id: z.string(),
    textAr: z.string(),
    correctPosition: z.number().optional(),
  })),
})

export const GroupResponseBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('group_response'),
  promptAr: z.string(),
  fieldLabels: z.array(z.string()),
  guidingQuestions: z.array(z.string()).optional(),
})

export const ReflectionBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('reflection'),
  prompts: z.array(z.string()),
  debriefGuideAr: z.string().optional(),
})

export const CheckBlockSchema = BaseStepBlockSchema.extend({
  type: z.literal('check'),
  questionAr: z.string(),
  criteria: z.array(z.string()),
})

export const StepBlockSchema = z.discriminatedUnion('type', [
  IntroBlockSchema,
  InstructionsBlockSchema,
  TimerBlockSchema,
  RolesBlockSchema,
  RevealBlockSchema,
  McqBlockSchema,
  ClassificationBlockSchema,
  SequencingBlockSchema,
  GroupResponseBlockSchema,
  ReflectionBlockSchema,
  CheckBlockSchema,
])

export type StepBlock = z.infer<typeof StepBlockSchema>

// Complete Activity Definition Schema
export const ActivityDefinitionSchema = z.object({
  id: z.string(),
  titleAr: z.string(),
  titleEn: z.string(),
  category: z.enum([
    'discussion',
    'investigation',
    'problem_solving',
    'peer_instruction',
    'classification',
    'feedback',
    'jigsaw',
  ]),
  targetCompetencies: z.array(z.string()), // competency ids
  suggestedAge: z.string().default('16–19 سنة'),
  suggestedGroupSize: z.string().default('4–5 طلاب'),
  durationMinutes: z.number(),
  preparationAr: z.string(),
  materialsAr: z.string(),
  lowResourceAlternativeAr: z.string(),
  pedagogicalRationaleAr: z.string(),
  steps: z.array(StepBlockSchema),
  failureModes: z.array(z.object({
    modeAr: z.string(),
    solutionAr: z.string(),
  })),
  differentiationAr: z.string(),
})

export type ActivityDefinition = z.infer<typeof ActivityDefinitionSchema>
