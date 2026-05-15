# API & Server Functions

Aura Companion uses TanStack Start's `createServerFn` to encapsulate backend logic, keeping the API layer type-safe and integrated directly with the frontend router.

## 1. Database Operations

- All interactions with the Supabase PostgreSQL database (e.g., fetching profiles, saving moods, logging journals, tracking experiences) are wrapped in `createServerFn`.
- This ensures that database credentials and service roles are never exposed to the client.

## 2. AI Integration

- AI requests to Google Gemini (e.g., chat responses, journal analysis) are executed server-side.
- The server functions construct the necessary context (moods, history, persona rules) from the database before querying the AI Gateway.

## 3. Execution Flow

1. Client calls a server function via a TanStack Query hook or directly in a route loader/action.
2. The server function authenticates the request using the Supabase session.
3. The server function executes the AI or DB logic.
4. Strongly typed results are returned to the client for rendering.
