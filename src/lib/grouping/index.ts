export interface GroupingStudent {
  id: string
  fullName: string
  studentCode?: string | null
  isPresent: boolean
  skillScore?: number | null // Recent average competency score (1.0 to 4.0), or null if unobserved
  pastPartnerIds?: string[] // IDs of students partnered with in recent sessions
}

export interface GroupingOptions {
  strategy: 'balanced' | 'random' | 'manual'
  targetGroupSize?: number // Default is 4 (range 3 to 5)
  seed?: number // Deterministic PRNG seed for testing
  roleTemplates?: Array<{
    id: string
    titleAr: string
    descriptionAr: string
  }>
}

export interface GeneratedGroupMember {
  studentId: string
  fullName: string
  roleTitle?: string
  roleDescription?: string
}

export interface GeneratedGroup {
  groupNumber: number
  groupName: string
  members: GeneratedGroupMember[]
}

export interface GroupingResult {
  groups: GeneratedGroup[]
  totalStudentsAssigned: number
  totalGroups: number
  excludedCount: number
  metrics: {
    averageGroupSize: number
    minGroupSize: number
    maxGroupSize: number
    varianceInSkill: number
    pairRepeatCount: number
  }
}

const DEFAULT_GROUP_NAMES_AR = [
  'مجموعة الصقور',
  'مجموعة النسور',
  'مجموعة الرواد',
  'مجموعة العلماء',
  'مجموعة الإبداع',
  'مجموعة القادة',
  'مجموعة الحكمة',
  'مجموعة الفرسان',
  'مجموعة النجوم',
  'مجموعة الأمل',
  'مجموعة العزيمة',
  'مجموعة التميز',
]

// Simple deterministic Linear Congruential Generator for reproducible seeded randomness
function createPrng(seed: number = 42) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/**
 * Calculates optimal number of groups and sizes ensuring:
 * - Every eligible student is in a group (No students dropped).
 * - Group sizes remain strictly between 3 and 5 (target 4 where possible).
 */
export function calculateGroupBucketSizes(totalStudents: number, targetSize: number = 4): number[] {
  if (totalStudents <= 0) return []
  if (totalStudents < 3) {
    // If fewer than 3, return a single small group
    return [totalStudents]
  }

  // Calculate target number of groups
  let numGroups = Math.round(totalStudents / targetSize)
  if (numGroups < 1) numGroups = 1

  // Ensure minimum size >= 3 and maximum size <= 5 where feasible
  while (numGroups > 1 && Math.floor(totalStudents / numGroups) < 3) {
    numGroups--
  }
  while (numGroups > 1 && Math.ceil(totalStudents / numGroups) > 5) {
    numGroups++
  }

  const baseSize = Math.floor(totalStudents / numGroups)
  const remainder = totalStudents % numGroups

  const sizes: number[] = []
  for (let i = 0; i < numGroups; i++) {
    sizes.push(baseSize + (i < remainder ? 1 : 0))
  }

  return sizes
}

/**
 * Core Grouping Engine
 */
export function generateStudentGroups(
  students: GroupingStudent[],
  options: GroupingOptions = { strategy: 'balanced' }
): GroupingResult {
  const prng = createPrng(options.seed ?? 12345)
  const targetSize = options.targetGroupSize ?? 4

  // Filter 1: Exclude absent students
  const activeStudents = students.filter((s) => s.isPresent)
  const excludedCount = students.length - activeStudents.length

  if (activeStudents.length === 0) {
    return {
      groups: [],
      totalStudentsAssigned: 0,
      totalGroups: 0,
      excludedCount,
      metrics: {
        averageGroupSize: 0,
        minGroupSize: 0,
        maxGroupSize: 0,
        varianceInSkill: 0,
        pairRepeatCount: 0,
      },
    }
  }

  // Compute bucket sizes
  const bucketSizes = calculateGroupBucketSizes(activeStudents.length, targetSize)
  const numGroups = bucketSizes.length

  // Initialize empty groups
  const groups: GeneratedGroup[] = bucketSizes.map((_, index) => ({
    groupNumber: index + 1,
    groupName: DEFAULT_GROUP_NAMES_AR[index % DEFAULT_GROUP_NAMES_AR.length] || `المجموعة ${index + 1}`,
    members: [],
  }))

  if (options.strategy === 'random' || options.strategy === 'manual') {
    // Shuffle students randomly
    const shuffled = [...activeStudents].sort(() => prng() - 0.5)

    let studentIndex = 0
    for (let g = 0; g < numGroups; g++) {
      const size = bucketSizes[g]
      for (let s = 0; s < size && studentIndex < shuffled.length; s++) {
        groups[g].members.push({
          studentId: shuffled[studentIndex].id,
          fullName: shuffled[studentIndex].fullName,
        })
        studentIndex++
      }
    }
  } else {
    // Balanced Strategy (Evidence-Informed Heterogeneous Grouping)
    // 1. Separate students into scored vs unobserved
    const scoredStudents = activeStudents.filter((s) => s.skillScore != null && !isNaN(s.skillScore))
    const unobservedStudents = activeStudents.filter((s) => s.skillScore == null || isNaN(s.skillScore))

    // Sort scored descending by skill score
    scoredStudents.sort((a, b) => (b.skillScore ?? 0) - (a.skillScore ?? 0))

    // Shuffle unobserved randomly with PRNG
    unobservedStudents.sort(() => prng() - 0.5)

    // Combined list: Serpentine distribution (Snake draft)
    const orderedCandidates = [...scoredStudents, ...unobservedStudents]

    // Distribute in snake draft order across groups to ensure balanced skill variance
    let groupIdx = 0
    let direction = 1

    for (const student of orderedCandidates) {
      // Find the first group that still has capacity according to bucketSizes
      let placed = false

      // Try preferred snake order
      if (groups[groupIdx].members.length < bucketSizes[groupIdx]) {
        groups[groupIdx].members.push({
          studentId: student.id,
          fullName: student.fullName,
        })
        placed = true
      } else {
        // Fallback: place in any group with remaining capacity
        for (let g = 0; g < numGroups; g++) {
          if (groups[g].members.length < bucketSizes[g]) {
            groups[g].members.push({
              studentId: student.id,
              fullName: student.fullName,
            })
            groupIdx = g
            placed = true
            break
          }
        }
      }

      if (placed) {
        // Advance snake pointer
        groupIdx += direction
        if (groupIdx >= numGroups) {
          groupIdx = numGroups - 1
          direction = -1
        } else if (groupIdx < 0) {
          groupIdx = 0
          direction = 1
        }
      }
    }
  }

  // Assign roles if role templates are provided
  if (options.roleTemplates && options.roleTemplates.length > 0) {
    groups.forEach((group) => {
      group.members.forEach((member, mIdx) => {
        const role = options.roleTemplates![mIdx % options.roleTemplates!.length]
        member.roleTitle = role.titleAr
        member.roleDescription = role.descriptionAr
      })
    })
  }

  // Calculate metrics
  let totalAssigned = 0
  let minSize = Infinity
  let maxSize = -Infinity
  let pairRepeatCount = 0

  const studentMap = new Map(activeStudents.map((s) => [s.id, s]))

  groups.forEach((g) => {
    const size = g.members.length
    totalAssigned += size
    if (size < minSize) minSize = size
    if (size > maxSize) maxSize = size

    // Check past pairings repeat
    for (let i = 0; i < g.members.length; i++) {
      const s1 = studentMap.get(g.members[i].studentId)
      if (s1 && s1.pastPartnerIds) {
        for (let j = i + 1; j < g.members.length; j++) {
          if (s1.pastPartnerIds.includes(g.members[j].studentId)) {
            pairRepeatCount++
          }
        }
      }
    }
  })

  // Compute skill variance across groups
  const groupSkillAverages: number[] = []
  groups.forEach((g) => {
    const scoredMembers = g.members
      .map((m) => studentMap.get(m.studentId)?.skillScore)
      .filter((score): score is number => score != null)

    if (scoredMembers.length > 0) {
      const avg = scoredMembers.reduce((a, b) => a + b, 0) / scoredMembers.length
      groupSkillAverages.push(avg)
    }
  })

  let variance = 0
  if (groupSkillAverages.length > 1) {
    const mean = groupSkillAverages.reduce((a, b) => a + b, 0) / groupSkillAverages.length
    variance = groupSkillAverages.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / groupSkillAverages.length
  }

  return {
    groups,
    totalStudentsAssigned: totalAssigned,
    totalGroups: groups.length,
    excludedCount,
    metrics: {
      averageGroupSize: Number((totalAssigned / (groups.length || 1)).toFixed(2)),
      minGroupSize: minSize === Infinity ? 0 : minSize,
      maxGroupSize: maxSize === -Infinity ? 0 : maxSize,
      varianceInSkill: Number(variance.toFixed(3)),
      pairRepeatCount,
    },
  }
}
