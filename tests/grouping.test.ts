import { describe, it, expect } from 'vitest'
import {
  calculateGroupBucketSizes,
  generateStudentGroups,
  GroupingStudent,
} from '../src/lib/grouping'

describe('Grouping Engine Tests', () => {
  function makeStudents(count: number, absentIndices: number[] = []): GroupingStudent[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `stu-${i + 1}`,
      fullName: `طالب تجريبي ${i + 1}`,
      isPresent: !absentIndices.includes(i),
      skillScore: i % 3 === 0 ? ((i % 4) + 1) : null, // mix of scored and unobserved
    }))
  }

  it('calculates correct bucket sizes for class of 20 (target 4 -> 5 groups of 4)', () => {
    const buckets = calculateGroupBucketSizes(20, 4)
    expect(buckets).toEqual([4, 4, 4, 4, 4])
    expect(buckets.reduce((a, b) => a + b, 0)).toBe(20)
  })

  it('calculates correct bucket sizes for uneven class of 31 without dropping any student', () => {
    const buckets = calculateGroupBucketSizes(31, 4)
    const sum = buckets.reduce((a, b) => a + b, 0)
    expect(sum).toBe(31)
    // Every bucket must be between 3 and 5
    buckets.forEach((size) => {
      expect(size).toBeGreaterThanOrEqual(3)
      expect(size).toBeLessThanOrEqual(5)
    })
  })

  it('calculates correct bucket sizes for large class of 40', () => {
    const buckets = calculateGroupBucketSizes(40, 4)
    expect(buckets.reduce((a, b) => a + b, 0)).toBe(40)
    expect(buckets.length).toBe(10)
  })

  it('assigns every eligible student exactly once in a class of 20', () => {
    const students = makeStudents(20)
    const result = generateStudentGroups(students, { strategy: 'balanced', targetGroupSize: 4 })

    expect(result.totalStudentsAssigned).toBe(20)
    expect(result.excludedCount).toBe(0)

    const assignedIds = new Set<string>()
    result.groups.forEach((g) => {
      g.members.forEach((m) => {
        expect(assignedIds.has(m.studentId)).toBe(false)
        assignedIds.add(m.studentId)
      })
    })
    expect(assignedIds.size).toBe(20)
  })

  it('strictly excludes absent students from all groups', () => {
    // 25 students, 3 absent (indices 2, 7, 12)
    const students = makeStudents(25, [2, 7, 12])
    const result = generateStudentGroups(students, { strategy: 'balanced', targetGroupSize: 4 })

    expect(result.excludedCount).toBe(3)
    expect(result.totalStudentsAssigned).toBe(22)

    result.groups.forEach((g) => {
      g.members.forEach((m) => {
        expect(['stu-3', 'stu-8', 'stu-13']).not.toContain(m.studentId)
      })
    })
  })

  it('handles missing/unobserved competency evidence without negative defaults', () => {
    // All students unobserved (skillScore = null)
    const students = Array.from({ length: 16 }, (_, i) => ({
      id: `stu-${i + 1}`,
      fullName: `طالب ${i + 1}`,
      isPresent: true,
      skillScore: null,
    }))

    const result = generateStudentGroups(students, { strategy: 'balanced', targetGroupSize: 4 })
    expect(result.totalStudentsAssigned).toBe(16)
    expect(result.totalGroups).toBe(4)
    result.groups.forEach((g) => {
      expect(g.members.length).toBe(4)
    })
  })

  it('assigns role titles when role templates are provided', () => {
    const students = makeStudents(12)
    const roleTemplates = [
      { id: 'r1', titleAr: 'الميسر', descriptionAr: 'إدارة الوقت' },
      { id: 'r2', titleAr: 'المسجل', descriptionAr: 'تدوين الأفكار' },
      { id: 'r3', titleAr: 'المتحدث', descriptionAr: 'عرض النتائج' },
      { id: 'r4', titleAr: 'فاحص الأدلة', descriptionAr: 'التدقيق والنقد' },
    ]

    const result = generateStudentGroups(students, {
      strategy: 'balanced',
      targetGroupSize: 4,
      roleTemplates,
    })

    result.groups.forEach((g) => {
      g.members.forEach((m) => {
        expect(m.roleTitle).toBeDefined()
        expect(['الميسر', 'المسجل', 'المتحدث', 'فاحص الأدلة']).toContain(m.roleTitle)
      })
    })
  })
})
