# Feature: AI Companion (The Orb)

The AI Companion is the emotional anchor of Aura Companion. It provides a visual and conversational presence, acting as an emotionally intelligent entity.

## 1. Visual Representation

The **Orb** is a custom SVG/CSS component in `src/components/companion/AICompanionOrb.tsx`. It provides a gentle, ambient visual presence that complements the conversational experience.

## 2. Interaction Model

The conversation flow is strictly governed by the following process:
`User Input -> Server Function -> Context Injection (Moods & History) -> AI Gateway -> Context-Aware Reply`

## 3. Chatbot Behavior Rules

As defined in `/ai-skills/chatbot-behavior.md`, the AI companion strictly adheres to these conversational guidelines:
- **Tone & Empathy**: Maintains a warm, natural, human-like style. Adapts tone based on user emotion (supportive, calm, motivating).
- **Immersion**: Never breaks immersion. Avoids robotic or overly technical responses unless explicitly asked.
- **Engagement**: Keeps responses concise but meaningful, asking gentle follow-up questions when appropriate.
- **Continuity**: Focuses on emotional connection, maintaining conversational context across sessions.
