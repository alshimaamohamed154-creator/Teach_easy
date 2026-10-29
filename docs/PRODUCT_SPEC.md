# Teach Easy (تيتش إيزي) — Product Specification
## Collaborative Learning Platform for Secondary Schools (Classroom-First & Interactive Whiteboard)

### 1. Executive Summary
Teach Easy is an Arabic-first educational web platform designed specifically for Egyptian secondary school teachers (grades 10–12 / الثانوية العامة, students aged 16–19). It transforms collaborative learning theories (Johnson & Johnson, Kagan Cooperative Learning, Mazur Peer Instruction) into an effortless classroom reality.

The core principle is:
> **The teacher manages the workflow; the entire class experiences the learning activity together on the interactive classroom board.**

Students do NOT need personal accounts, smartphones, or separate devices. The application runs on the teacher's computer connected to the interactive whiteboard / classroom display screen.

---

### 2. Primary User & Classroom Context
- **Primary User**: Secondary school teachers (STEM, Humanities, Languages, Social Studies).
- **Physical Setting**: Public and private Egyptian high school classrooms equipped with an Interactive Smart Screen / Whiteboard (شاشة تفاعلية ذكية) or projector.
- **Student Profile**: Egyptian secondary stage students (16–19 years old).
- **Constraints Handled**:
  - Unstable classroom student connectivity -> Zero student devices required.
  - Large or uneven class sizes (20 to 50+ students) -> Automated balanced grouping engine with manual overrides.
  - Limited lesson time (40–45 minutes) -> Fast setup (< 2 min), integrated classroom timer, phased reveal steps.
  - Arabic language & RTL ergonomics -> Native Arabic UI, Cairo/IBM Plex Arabic typography, logical CSS properties.

---

### 3. Core User Journeys

#### A. Teacher Workspace (وضع إدارة المعلم)
1. **Authentication**: Secure email/password login, password recovery, session persistence with Supabase SSR Auth.
2. **Dashboard**: Live metrics of classes, active sessions, completed activities, recent competency observations.
3. **Class & Roster Management**:
   - Create classes (e.g. "الصف الثاني الثانوي - علمي 1").
   - Student roster management (Add, edit, search, CSV import, status management).
   - Minimal PII: only full name and optional student classroom code.
4. **Activity Library**:
   - 8 fully structured, evidence-informed collaborative activities.
   - Filterable by competency, group size, duration, subject area.
5. **Session Planner & Setup**:
   - Select class, pick active attendees.
   - Select activity & configure strategy (Balanced, Random, Manual).
   - Automatic role assignment (Leader, Recorder, Spokesperson, Timekeeper, Skeptic/Devil's Advocate).
   - Teacher review and manual swap/lock before launch.
6. **Assessment & Reflection**:
   - Post-session rubric assessment on 8 observable competencies (4 developmental levels + Unobserved).
   - Fast batch rating interface.
   - Individual understanding check tracker.
   - Historical development timeline per student/class.

#### B. Interactive Classroom Board Mode (وضع الشاشة التفاعلية الذكية)
Route: `/teacher/sessions/[sessionId]/board`
1. High-contrast, large touch-friendly typography (48–64px touch targets).
2. Native Fullscreen support with single tap.
3. Landscape 16:9 responsive layout optimized for projection and interactive touchscreens.
4. Stage-by-stage instructional progression (Introduction -> Objective -> Instructions -> Team Roles -> Timer & Prompts -> Interactive Tap Challenge -> Team Debrief).
5. Tap-based manipulation (reordering, classification, multiple-choice selection) — NO drag-only requirements.
6. **Classroom Privacy Protection**: Strict Board DTO filtering. Teacher personal notes, student weaknesses, and academic rankings are NEVER rendered in board mode.

---

### 4. Competency Framework (8 Core Collaborative Skills)
1. **الاستماع الفعال (Active Listening)**
2. **الشرح وتعليم الأقران (Clear Explanation & Peer Teaching)**
3. **الاختلاف البنّاء والتفاوض الفكري (Constructive Disagreement)**
4. **المشاركة الشاملة وتشجيع الفريق (Inclusive Participation)**
5. **المسؤولية المشتركة والموثوقية (Shared Responsibility & Reliability)**
6. **حل المشكلات التشاركي (Collaborative Problem Solving)**
7. **تقديم واستقبال التغذية الراجعة (Constructive Feedback)**
8. **التأمل الذاتي والتطوير (Self-Reflection & Improvement)**

Development Levels:
- **مبتدئ (Emerging - 1)**
- **نامٍ (Developing - 2)**
- **متمكن (Proficient - 3)**
- **متقدم (Advanced - 4)**
- **غير ملحوظ (Unobserved - NULL)** — Distinct from low performance.
