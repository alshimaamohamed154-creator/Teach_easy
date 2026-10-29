# Teach Easy — Architecture Specification

### 1. High-Level System Architecture

Teach Easy employs a clean, modular, monolithic Next.js App Router architecture backed by Supabase PostgreSQL with strict Row Level Security (RLS).

```
[ Classroom Interactive Whiteboard / Teacher Laptop ]
                      │  (HTTPS / Cookie-based SSR)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Next.js 16 (App Router)                 │
│                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────┐  │
│  │    Teacher Workspace    │  │ Classroom Board Mode │  │
│  │   (RTL SaaS Admin UI)   │  │   (Large Touch UI)   │  │
│  └───────────┬─────────────┘  └──────────┬───────────┘  │
│              │                           │              │
│  ┌───────────▼───────────────────────────▼───────────┐  │
│  │        Server-Side Data Access Layer (DAL)        │  │
│  │         (Auth Checks, Zod DTO Validation)         │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │   Activity Runtime Engine & Grouping Heuristic    │  │
│  └───────────────────────┬───────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │ (Supabase Client with SSR Auth Cookies)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase PostgreSQL                   │
│                                                         │
│  - Row Level Security (RLS) policies per teacher_id     │
│  - Normalized schema: classes, students, sessions, etc. │
│  - Versioned session activity snapshots & responses     │
└─────────────────────────────────────────────────────────┘
```

---

### 2. Key Architecture Principles

1. **Server-First with Progressive Interactivity**:
   - Private teacher workflows (roster, sessions, assessment) are server-rendered with Server Actions.
   - Interactive components (board timers, step transitions, tap selectors) are Client Components bounded inside their respective step wrappers.

2. **Strict Multi-Tenant Isolation via RLS**:
   - Every exposed table has `teacher_id` linked to `auth.uid()`.
   - RLS policies ensure Teacher A cannot read, insert, update, or delete Teacher B's records under any circumstance.
   - No sensitive service-role keys are exposed in client bundles.

3. **Separation of Presentation DTOs (Board Safety)**:
   - Data passed to the Classroom Board route (`/teacher/sessions/[sessionId]/board`) is explicitly projected through a Board DTO (`toBoardSessionDTO`).
   - Private teacher notes, student evaluation histories, and individual academic weaknesses are physically stripped on the server before the JSON payload is dispatched.

4. **Deterministic Heuristic Grouping Engine**:
   - Modular engine inside `src/lib/grouping/`.
   - Balances groups based on historical competency scores (or random fallback when data is sparse).
   - Enforces hard constraints (group sizes 4–5, uneven class handling, absence exclusion) and soft preferences (avoiding duplicate recent pairings).

5. **Extensible Typed Activity Runtime**:
   - Activities are defined as immutable, typed configurations adhering to a strict Zod schema (`ActivityDefinitionSchema`).
   - Supported block types:
     - `intro`: Objectives and high-level briefing.
     - `instructions`: Step-by-step guidance.
     - `timer`: Individual thinking or group debate countdown.
     - `roles`: Role breakdown and responsibilities.
     - `reveal`: Hidden hints or solutions revealed on tap.
     - `mcq`: Peer Instruction / conceptual multiple choice question.
     - `classification`: Tap-to-categorize concepts into target buckets.
     - `sequencing`: Tap-to-reorder process steps or chronological events.
     - `group_response`: Shared group submission canvas / answer recorder.
     - `reflection`: Group debrief prompts.
     - `check`: Individual understanding check.

6. **Arabic RTL System**:
   - Native `dir="rtl"` and `lang="ar"` at document root.
   - Uses CSS logical properties (`margin-inline-start`, `text-start`, `border-inline-end`).
   - Clean Arabic typography utilizing system Arabic fallback stack and Geist/Cairo font styling.
