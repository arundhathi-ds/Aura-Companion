import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB94EMHBfkn6vgV4Gz40CKCZuayrk0OCN4";

// ==========================================
// EXPANDED DYNAMIC VOCABULARY MATRIX (PLAYFUL & CINEMATIC)
// ==========================================
const ACTIONS = {
  indoor: [
    "rearrange one corner of your room",
    "photograph the weirdest object",
    "pretend your room belongs to a mysterious character",
    "make the ugliest drawing possible",
    "build the ultimate comfort snack or drink combo",
    "turn off the main light and create the coziest corner",
    "put on one dramatic song and speed-clean",
    "sketch a quick chaotic idea",
    "curate a tiny fake museum exhibit",
    "find a shadow that looks alive"
  ],
  outdoor: [
    "step outside for exactly 2 minutes and find one window",
    "enter a random store and buy the strangest snack",
    "find the coolest glowing light, sign, or reflection",
    "walk one street you've never properly noticed before",
    "find one object outside that looks suspiciously important",
    "play one dramatic song and walk down the street",
    "take a wrong turn on purpose and document what you find",
    "spot a neon sign or a glowing window"
  ]
};

const OBJECTS = {
  indoor: [
    "like it belongs on an indie album cover",
    "as cursed museum evidence with a secret purpose",
    "finding 3 objects that reveal their personality",
    "under 60 seconds with your only goal being absolute creative chaos",
    "using only what already exists in your kitchen",
    "using only one glowing lamp or candle",
    "exactly one chaotic area before the song ends",
    "interpreting a random creative concept",
    "labeling ordinary items with mysterious secret descriptions",
    "watching how it changes over the next three minutes"
  ],
  outdoor: [
    "that is still glowing in the quiet dark",
    "priced under ₹100",
    "documenting it like cyberpunk evidence",
    "focusing on details you've never stopped to look at before",
    "as if it is evidence left from another dimension",
    "as if the camera is following you in slow motion",
    "focusing on the first interesting or fake-looking thing",
    "that feels like it is waiting for someone in the quiet hours"
  ]
};

const HOOKS = {
  indoor: [
    "Tonight has a quiet, glowing quality.",
    "Rain changes how rooms feel.",
    "Your room holds secrets you've stopped noticing.",
    "Aesthetic inspiration can strike in the smallest corners.",
    "The air is warm and comfortable inside.",
    "This space belongs to you completely tonight.",
    "Let's make something beautifully chaotic."
  ],
  outdoor: [
    "Tonight feels electric outside.",
    "The streets are waiting for an observer.",
    "The outdoor atmosphere is alive and glowing.",
    "Let's test the edges of the neighborhood.",
    "There's something suspicious about the quiet hours outside.",
    "Wandering is the ultimate form of art."
  ]
};

const ATMOSPHERES = ["cozy", "playful", "chaotic", "cinematic", "dreamy", "mysterious", "adventurous"];

const REFLECTIVE_QUESTIONS = [
  "What detail stayed with you?",
  "Did anything feel cinematic?",
  "What looked completely different today?",
  "What did the light remind you of?",
  "Would you return to that state?",
  "What was the quietest thing you noticed?",
  "Which color or shape did you hold onto?",
  "Did the atmosphere feel like an indie movie scene?"
];

// Helper to select a random item
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * Fallback Programmatic Synthesizer (Endlessly Fresh & Playful)
 */
function programmaticallySynthesizeQuest(door: string, mood: string, time: string, zone?: string): any {
  const isOutdoor = door === "Let's Go Somewhere";
  const typeKey = isOutdoor ? "outdoor" : "indoor";

  const hook = random(HOOKS[typeKey]);
  const action = random(ACTIONS[typeKey]);
  const obj = random(OBJECTS[typeKey]);
  const atmosphere = random(ATMOSPHERES);
  const question = random(REFLECTIVE_QUESTIONS);

  // Parse Action for capitalization
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
  const title = isOutdoor 
    ? `${random(["Cyberpunk", "Wandering", "Street", "Expedition"])} Quest` 
    : `${random(["Cozy", "Chaotic", "Album Cover", "Creative"])} Ritual`;

  const step1 = {
    instruction: `${hook} ${capitalizedAction} ${isOutdoor && zone ? `within your ${zone.toLowerCase()} radius` : ""}.`,
    vibe: "Arrival"
  };

  const step2 = {
    instruction: `Do this ${obj}. Make it memorable, fun, and low friction.`,
    vibe: atmosphere.charAt(0).toUpperCase() + atmosphere.slice(1)
  };

  return {
    title,
    category: isOutdoor ? "exploration" : "creativity",
    steps: [step1, step2],
    fieldNoteQuestion: question
  };
}

/**
 * Taste Profiler Helper
 */
async function detectUserTasteProfile(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("completed_experiences")
      .select("note, experience_slug")
      .eq("user_id", userId)
      .limit(30);

    if (error || !data || data.length === 0) {
      return "Curious Flâneur (enjoys general aesthetics, atmospheric wandering, sensory observation)";
    }

    let visual = 0;
    let cozy = 0;
    let literary = 0;
    let urban = 0;

    const visualKeys = ["photo", "photograph", "camera", "light", "shadow", "reflection", "color", "mirror", "lens", "frame", "picture", "neon"];
    const cozyKeys = ["cafe", "tea", "coffee", "mug", "drink", "snack", "taste", "warm", "nest", "blanket", "cozy", "soft", "kitchen", "eat"];
    const literaryKeys = ["book", "read", "poem", "write", "sign", "library", "bookstore", "page", "letter", "words", "paper", "notebook"];
    const urbanKeys = ["walk", "street", "building", "bench", "alley", "explore", "intersection", "path", "neighborhood", "city", "park", "store"];

    for (const c of data) {
      const text = `${c.note || ""} ${c.experience_slug || ""}`.toLowerCase();
      for (const k of visualKeys) if (text.includes(k)) visual++;
      for (const k of cozyKeys) if (text.includes(k)) cozy++;
      for (const k of literaryKeys) if (text.includes(k)) literary++;
      for (const k of urbanKeys) if (text.includes(k)) urban++;
    }

    const max = Math.max(visual, cozy, literary, urban);
    if (max === 0) return "Curious Flâneur (enjoys general aesthetics, atmospheric wandering, sensory observation)";
    if (max === visual) return "Visual Archivist (photographic angles, neon lights, shadow frames, color mapping)";
    if (max === cozy) return "Tactile Dreamer (sensory taste combos, cozy rooms, cafes, holding warm mugs)";
    if (max === literary) return "Quiet Inquirer (store signs, bookstores, written words, lost letters, folding paper)";
    return "Curious Flâneur (sidewalk walking, alleys, neighborhoods, quiet benches, store hunting)";
  } catch (e) {
    console.error("Failed to detect taste profile:", e);
    return "Curious Flâneur (enjoys general aesthetics, atmospheric wandering, sensory observation)";
  }
}

// ==========================================
// POETIC LIFESTYLE GENERATION PROMPT (UPGRADED)
// ==========================================
const LIFESTYLE_PROMPT = `
You are Aura, a cinematic transmission system designed to generate tiny real-world adventures, side quests, and aesthetic discovery missions.
Your goal is to construct one extremely fresh, dynamic, and action-oriented side quest based on the user's chosen Door.

DOOR CHOSEN: {{door}}
COMFORT ZONE (if applicable): {{zone}}
LOCAL TIME: {{time}}
WEATHER STATE: {{weather}}
USER MOOD: {{mood}}
ENERGY LEVEL: {{energy}}
USER TASTE PROFILE: {{taste}}
RECENT HISTORY (Avoid repeating these slugs or concepts): {{history}}

CORE EXPERIENCE STYLE GUIDELINES:
1. Every generated side quest MUST follow this exact three-part emotional structure:
   - Part 1: Immediate atmospheric hook (e.g., "Tonight feels electric." or "Rain changes how rooms feel.")
   - Part 2: Tiny achievable action (e.g., "Find the coolest light outside..." or "Turn off the main light...")
   - Part 3: Cinematic/playful twist (e.g., "...and document it like cyberpunk evidence." or "...and create the coziest corner possible using only one lamp.")
2. Side quests must be fun, playful, instantly actionable, curiosity-driven, emotionally light, and highly memorable.
3. NEVER generate therapy exercises, mindfulness homework, passive breathing, boring self-improvement challenges, or heavy journaling prompts.
4. Adapting to energy:
   - If energy is LOW: Generate 2-minute achievable room rituals, sensory warm drinks, cozy lamp observation, puddle window spotting.
   - If energy is HIGH or RESTLESS: Generate speed-cleaning areas before a dramatic song ends, wrong-turn city expeditions, snack hunts under ₹100, dramatic walk scenes.
5. Format your output strictly in JSON. Provide a "title" (no longer than 4 words), "category" (either 'exploration' or 'creativity'), an array of exactly 2 "steps" (step 1 holds the Hook + Action, step 2 holds the Twist action, each with an 'instruction' text and a 1-word 'vibe' tag), and exactly ONE poetic reflection question under 'fieldNoteQuestion'.

ORB TRANSMISSION STYLE GUIDE:
- Sound cinematic, modern, playful, human, and emotionally alive.
- NEVER use over-poetic robotic AI phrasing or clinical wellness words like: "task", "objective", "wellness", "self improvement", "healing journey", "mindfulness", "AI recommendation".
- Refer to the experience as a "side quest", "tonight’s mission", "tiny adventure", "wandering prompt", "strange little mission", or "atmospheric invitation".

JSON Output Format (Strictly return raw JSON without backticks or tags):
{
  "title": "[Title of Side Quest]",
  "category": "exploration",
  "steps": [
    { "instruction": "[Step 1 Atmospheric Hook + Achievable Action]", "vibe": "[Vibe tag]" },
    { "instruction": "[Step 2 Cinematic Playful Twist Action]", "vibe": "[Vibe tag]" }
  ],
  "fieldNoteQuestion": "[One small observational field note question]"
}
`;

export const generateCinematicExperience = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => 
    z.object({
      userId: z.string(),
      mood: z.string(),
      door: z.string(), // 'Stay With Me' or 'Let's Go Somewhere'
      zone: z.string().optional(),
      time: z.string(),
      history: z.string().optional(),
      weather: z.string().optional(),
      energy: z.string().optional(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    try {
      // 1. Detect Taste Profile
      const tasteProfile = await detectUserTasteProfile(data.userId);

      // 2. Synthesize prompt
      const seed = Math.random().toString(36).substring(7);
      const prompt = LIFESTYLE_PROMPT
        .replace("{{mood}}", data.mood)
        .replace("{{door}}", data.door)
        .replace("{{zone}}", data.zone || "Home")
        .replace("{{time}}", data.time)
        .replace("{{weather}}", data.weather || "Clear Sky")
        .replace("{{energy}}", data.energy || "Normal")
        .replace("{{taste}}", tasteProfile)
        .replace("{{history}}", data.history || "None")
        .replace("{{seed}}", seed);

      // 3. Request from Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
        const parsed = JSON.parse(content);

        // Verification against duplication
        const recentSlugs = (data.history || "").toLowerCase();
        const newSlug = (parsed.title || "").toLowerCase().replace(/ /g, "-");
        if (newSlug && recentSlugs.includes(newSlug)) {
          console.warn("Gemini returned duplicate experience in history. Regenerating locally.");
          return programmaticallySynthesizeQuest(data.door, data.mood, data.time, data.zone);
        }

        return parsed;
      }
    } catch (e) {
      console.error("Gemini Generation failed. Triggering Local programmatical synthesizer:", e);
    }

    // 4. Offline Fallback
    return programmaticallySynthesizeQuest(data.door, data.mood, data.time, data.zone);
  });
