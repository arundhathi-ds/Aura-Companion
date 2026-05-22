# AI Systems

Aura Companion integrates Google Gemini to power its emotional intelligence and conversational capabilities.

## 1. Companion Personality (The Orb)

The AI acts as a gentle, non-judgmental companion. 
- **Tone:** Soft, poetic, using 1-3 short sentences.
- **Empathy:** Reflects the user's mood before acting.
- **Constraints:** No clinical advice, no long bulleted lists, and no markdown bolding in chat.

## 2. Emotional Intelligence

- **Context Flow:** `User Mood -> Context Injection -> AI Response -> Reflection Mirroring`.
- The system injects the `current_mood` and `recent_moods` (from Supabase) into the AI prompt before generating a response.
- **Memory System:** Combines short-term session state with long-term profile data (last 5 moods, last 3 experiences) to provide context-aware interactions.

## 3. Journaling Engine

- **Analysis:** Private journaling uses a server function (`analyzeJournal`) to analyze user entries.
- **Extraction:** The AI extracts emotion and generates a single tender summary sentence that captures the heart of the user's entry.

## 4. Exploration & Music Engine

- **Lifestyle Exploration:** A cinematic, multi-step adventure generator (See [aura-exploration-engine.md](../../ai-skills/aura-exploration-engine.md)).
- **Music Discovery:** A curated hit-discovery system covering 6 languages (English, Tamil, Hindi, Malayalam, Spanish, Korean).
- **Variety Logic:** Uses User IDs and session seeds to ensure 100% unique experiences for every user.
