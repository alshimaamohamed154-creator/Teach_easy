# Teach Easy — Requirements Traceability Matrix

| Req ID | Requirement Description | Category | Architecture / File Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | Arabic-first RTL design system & typography | UI/UX | `src/app/layout.tsx`, `src/app/globals.css` | Verified |
| **REQ-02** | Secure Teacher Authentication (SSR) | Security | `src/utils/supabase/`, `src/proxy.ts`, `src/app/login/` | Verified |
| **REQ-03** | PostgreSQL schema with full Row Level Security | Database | `supabase/migrations/20261029_init.sql` | In Progress |
| **REQ-04** | Class & Roster Management (Add/Edit/Search/CSV) | Teacher Workspace | `src/app/teacher/classes/` | In Progress |
| **REQ-05** | Minimal PII Student Records | Privacy | `src/app/teacher/classes/`, `src/lib/types/` | In Progress |
| **REQ-06** | 8 Complete Collaborative Learning Activities | Curriculum / Content | `src/lib/activities/` | In Progress |
| **REQ-07** | Reusable Activity Runtime (Blocks & Timers) | Interactive Engine | `src/components/board/`, `src/lib/activities/schema.ts` | In Progress |
| **REQ-08** | Grouping Engine (Balanced, Random, Manual) | Algorithm | `src/lib/grouping/` | In Progress |
| **REQ-09** | Role Allocation & Historical Group Memory | Algorithm | `src/lib/grouping/roles.ts` | In Progress |
| **REQ-10** | Dedicated Classroom Board Mode Route | Classroom UI | `src/app/teacher/sessions/[sessionId]/board/` | In Progress |
| **REQ-11** | Board Privacy DTO (No private notes/weaknesses) | Security / Privacy | `src/lib/dto/board.ts` | In Progress |
| **REQ-12** | Tap-based Whiteboard Interactions (48-64px targets) | Accessibility / Touch | `src/components/board/blocks/` | In Progress |
| **REQ-13** | 8-Competency Behavioral Assessment Framework | Assessment | `src/lib/competencies/` | In Progress |
| **REQ-14** | Fast Post-Session Teacher Assessment UI | Teacher Workspace | `src/app/teacher/sessions/[sessionId]/assessment/` | In Progress |
| **REQ-15** | Teacher Dashboard & Educational Analytics | Teacher Workspace | `src/app/teacher/dashboard/` | In Progress |
| **REQ-16** | Automated Tests (Unit, Grouping, DTOs) | QA | `tests/` | In Progress |
| **REQ-17** | Production Build & Vercel Live Deployment | DevOps | `next.config.ts`, Vercel CLI | Verified |
