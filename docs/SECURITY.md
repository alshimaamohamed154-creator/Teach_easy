# Teach Easy — Security & Data Protection Specification

### 1. Threat Model & Security Boundaries
Teach Easy operates under a multi-tenant model where authenticated teachers independently own their classrooms, students, and session observations.

#### Primary Threat Vectors Addressed:
1. **Cross-Tenant Data Exposure**:
   - *Mitigation*: Row Level Security (RLS) enabled on all tables with explicit `teacher_id = auth.uid()` checks.
2. **Accidental Classroom Display Leaks (Board Mode)**:
   - *Mitigation*: Board routes use dedicated `BoardSessionDTO` omitting private teacher notes, competency rubrics, and individual academic weaknesses.
3. **Student Privacy & Minors Data Protection**:
   - *Mitigation*: Minimal PII principle. Zero storage of Egyptian National IDs, student phone numbers, addresses, photos, or biometrics. Student accounts are completely prohibited in MVP.
4. **Injection & Input Tampering**:
   - *Mitigation*: All mutations validated at runtime with Zod schemas. Parameterized queries via Supabase PostgreSQL.
5. **Session Hijacking & Cookie Manipulation**:
   - *Mitigation*: Modern `@supabase/ssr` with HttpOnly, SameSite=Lax, Secure cookies refreshed via Next.js `proxy.ts`.

---

### 2. Row Level Security (RLS) Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` |
| `classes` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` |
| `students` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` |
| `class_enrollments` | Enrolled in teacher's class | Enrolled in teacher's class | Enrolled in teacher's class | Enrolled in teacher's class |
| `sessions` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` |
| `session_participants` | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher |
| `session_groups` | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher |
| `session_group_members`| Session belongs to teacher | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher |
| `session_responses` | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher |
| `student_competency_observations` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` | `teacher_id = auth.uid()` |
| `session_assessments` | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher | Session belongs to teacher |

---

### 3. Egyptian Personal Data Protection Compliance Notes (Law No. 151/2020)
- **Data Minimization**: The platform strictly processes only the minimum classroom identifiers necessary to facilitate cooperative learning.
- **Children's Privacy Protection**: Secondary students are predominantly 16–18 years of age (minors). By removing student accounts and mobile apps entirely, students never provide consent, passwords, or personal credentials.
- **Teacher Responsibility**: Teachers act as the authorized educational custodian within their accredited school setting.
