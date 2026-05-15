# Technical Architecture

Aura Companion is built as a full-stack web application leveraging a modern, type-safe stack.

## 1. Core Stack

- **Framework:** React 19 with TanStack Start (Server-Side Rendering & API Routes).
- **Routing:** TanStack Router for type-safe client and server routing.
- **Styling:** Tailwind CSS (v4) with Framer Motion for cinematic, fluid animations.
- **State Management:** TanStack Query for server state; local React hooks for UI state.
- **Database & Auth:** Supabase (PostgreSQL).

## 2. Architecture Flow

`[Client UI]` -> `[TanStack Router]` -> `[TanStack Start Server Functions]` -> `[Supabase DB / Google Gemini AI]`

## 3. Preservation Rules

As defined in `/ai-skills/architecture-rules.md`, all further development MUST:
- Preserve the TanStack Start architecture and existing routing structure.
- Keep the React component hierarchy and folder organization unchanged.
- Maintain the Tailwind CSS structure and Framer Motion implementation.
- Keep Supabase and Gemini AI integration patterns intact.
