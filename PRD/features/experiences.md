# Feature: Dynamic Experience Engine

The Dynamic Experience Engine transforms the user's emotional state ("feelings") into actionable, real-world micro-activities ("doings"). It suggests delightful, context-aware activities based on the user's mood, time of day, and weather.

## 1. Catalog

The core catalog of experiences is stored in `src/data/experiences.ts`. Each experience is categorized and tagged with associated moods, energy levels, and environmental conditions.

## 2. Recommendation Logic

The AI Recommendation Engine (detailed in `/ai-skills/recommendation-engine.md`) follows this algorithm:
- **Energy Matching:** Matches activity vibes (e.g., restorative, active) to the current user energy and mood.
- **Context Filtering:** Filters suggestions by current time of day and local weather conditions.
- **Variety:** Prioritizes least-recently completed activities to ensure fresh experiences.

## 3. UI/UX Rules

- Experiences are presented as glassmorphism cards.
- Transitions and reveals use soft, floating Framer Motion animations.
- The interface maintains the overarching dark, cinematic aesthetic.
