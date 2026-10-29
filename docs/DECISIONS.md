# Teach Easy — Architectural & Product Decisions Log (ADR)

### ADR 001: Monolithic Next.js 16 App Router with Supabase
- **Context**: The product requires rapid development, rock-solid security, fast server rendering, and interactive classroom board touch experiences.
- **Decision**: Adopt Next.js 16 App Router paired directly with Supabase PostgreSQL and `@supabase/ssr`.
- **Consequences**: Avoids complexity of separate backend services or microservices. Leverages Next.js Server Actions and SSR cookies.

### ADR 002: Single-Device Interactive Whiteboard vs Multi-Device Sync
- **Context**: Egyptian public and private classrooms often suffer from unreliable student Wi-Fi and school phone bans.
- **Decision**: Optimize exclusively for a single authenticated teacher device connected to the interactive whiteboard display.
- **Consequences**: No Supabase Realtime synchronization needed for the MVP. Students interact physically at the smart board or verbally in their designated groups. Massive reduction in complexity and failure points.

### ADR 003: Board Mode Route Isolation & DTO Sanitization
- **Context**: The smart board is publicly visible to 30–50 students. Any display of confidential teacher notes or student academic rankings causes stigma and violates privacy.
- **Decision**: Create an isolated route (`/teacher/sessions/[sessionId]/board`) backed by a strict server-side `BoardSessionDTO` transformation that physically purges notes, competency levels, and private observations.
- **Consequences**: Zero risk of accidental leakage even if client-side code is inspected.

### ADR 004: Versioned Immutable Activity Snapshots
- **Context**: When an activity template is updated in the future, past completed or ongoing sessions should reflect the exact instructions, rubrics, and steps used at that time.
- **Decision**: Store the full parsed `ActivityDefinition` as a JSONB snapshot in `sessions.activity_snapshot`.
- **Consequences**: Historical consistency guaranteed without requiring a complex database schema for dynamic activity builders.

### ADR 005: Tap-First Classroom Touch Interaction (No Drag-Only)
- **Context**: Classroom smart boards often suffer from laggy or inaccurate touch drag detection. Students standing at the board need immediate, error-free interaction.
- **Decision**: All interactive whiteboard blocks (sequencing, classification, MCQ) operate through large tap targets (48–64px) with tap-to-select and tap-to-place actions.
- **Consequences**: 100% accessible on touchscreens, large projectors, and with standard mouse pointers.
