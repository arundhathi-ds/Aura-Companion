import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB94EMHBfkn6vgV4Gz40CKCZuayrk0OCN4";

const STORY_PROMPT = `
You are Aura, a cinematic Lifestyle Exploration Companion.
Your goal is to guide the user through a multi-step real-world ritual or adventure.

CONTEXT:
- MOOD: {{mood}}
- MODE: {{vibeMode}} (e.g., Romanticize My Life, Go Outside, Creative Escape)
- TIME: {{time}}
- HISTORY: {{history}}
- LOCATION: {{nearby}}

TASK: Generate a 3-4 step immersive journey.
Each step should be a specific, cinematic action. 

Output ONLY a JSON object:
{
  "title": "Cinematic Title",
  "isChallenge": boolean,
  "steps": [
    {"instruction": "Step 1 text", "vibe": "1-word energy"},
    {"instruction": "Step 2 text", "vibe": "1-word energy"}
  ],
  "hiddenOutcome": {
    "type": "insight | fragment | quote",
    "content": "Secret message revealed only at the very end",
    "auraObservation": "Something Aura noticed about the user's pattern"
  },
  "openingThought": "A soft, caring 1-sentence thought from Aura during reveal"
}
`;

export const generateCinematicExperience = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => 
    z.object({
      mood: z.string(),
      vibeMode: z.string(),
      time: z.string(),
      nearby: z.string().optional(),
      history: z.string().optional(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    try {
      const prompt = STORY_PROMPT
        .replace("{{mood}}", data.mood)
        .replace("{{vibeMode}}", data.vibeMode)
        .replace("{{time}}", data.time)
        .replace("{{history}}", data.history || "Fresh start")
        .replace("{{nearby}}", data.nearby || "Anywhere");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json", temperature: 1.0 }
          }),
        }
      );

      const json = await response.json();
      let content = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("Cinematic engine failure:", e);
    }

    // High-quality multi-step fallback
    return {
      title: "The Quiet Observation",
      isChallenge: false,
      openingThought: "Sometimes the most profound moments are the ones we simply witness.",
      steps: [
        { instruction: "Find a window and watch the sky for two full minutes.", vibe: "Stillness" },
        { instruction: "Notice one detail you've never paid attention to before.", vibe: "Discovery" },
        { instruction: "Whisper a single word that describes this feeling.", vibe: "Presence" }
      ],
      hiddenOutcome: {
        type: "quote",
        content: "Silence is a source of Great Strength.",
        auraObservation: "You find peace in the small details of your home."
      }
    };
  });
