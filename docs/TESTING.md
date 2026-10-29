# Teach Easy — Testing Strategy & Verification Suite

### 1. Testing Scope & Methodology
Testing for Teach Easy covers:
1. **Grouping Engine Unit Tests (`tests/grouping.test.ts`)**:
   - Class size variants: 20 students, 31 students (uneven), 40 students (large).
   - Zero student drops: every attendee assigned to exactly one group.
   - Exclusion of absent students.
   - Balanced skill distribution vs random fallback.
   - Reduction of duplicate past pairings.
   - Role allocation coverage.
2. **Board Safety & DTO Sanitization Tests (`tests/board-dto.test.ts`)**:
   - Stripping of confidential teacher notes.
   - Elimination of academic grades or competency rankings.
   - Correct projection of student display names and team numbers.
3. **Activity Runtime Schema Validation (`tests/activity-schema.test.ts`)**:
   - Validation of all 8 structured activities against `ActivityDefinitionSchema`.
   - Block type validation (timers, classification buckets, sequencing items, MCQ choices).
4. **End-to-End Build & Lint Verification**:
   - `npm run build` with Turbopack and strict TypeScript checking.
   - Vitest automated test suite execution.
