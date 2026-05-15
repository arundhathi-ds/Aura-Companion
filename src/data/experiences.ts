/**
 * Curated experience catalog for the Dynamic Experience Engine.
 *
 * This file is the single source of truth for available experiences.
 * It can later be swapped/augmented by an AI generator (Lovable AI) — keep
 * the shape of `Experience` stable so the engine and UI continue to work.
 */

export type ExperienceCategory = "creative" | "emotional" | "social" | "adventure";

export type ExperienceVibe =
  | "Calm Evening"
  | "Quiet Curiosity"
  | "Creative Spark"
  | "Gentle Exploration"
  | "Emotional Reset"
  | "Soft Motivation"
  | "Restless Creativity"
  | "Tender Solitude";

export type TimeOfDay = "morning" | "afternoon" | "golden_hour" | "evening" | "night";
export type WeatherFit = "sunny" | "cloudy" | "rainy" | "any";

export type Experience = {
  slug: string;
  title: string;
  description: string;          // poetic, 1-2 lines
  reasoning: string;            // why this matters emotionally
  category: ExperienceCategory;
  vibe: ExperienceVibe;
  energy: 1 | 2 | 3 | 4 | 5;     // 1 = barely-anything, 5 = bold
  social: 0 | 1 | 2;             // 0 solo, 1 quiet-public, 2 social
  bestTimes: TimeOfDay[];
  weather: WeatherFit;
  moods: string[];               // mood tags it suits (lowercase)
  focusAreas: string[];          // matches profile.focus_areas
  durationMin: number;
  gradient: string;              // tailwind/css gradient hex, used in cards
};

const G = {
  dusk:    "linear-gradient(135deg, oklch(0.55 0.18 30 / 0.55), oklch(0.45 0.2 295 / 0.55))",
  ocean:   "linear-gradient(135deg, oklch(0.55 0.16 220 / 0.55), oklch(0.45 0.18 280 / 0.55))",
  ember:   "linear-gradient(135deg, oklch(0.65 0.2 50 / 0.55), oklch(0.55 0.2 320 / 0.5))",
  forest:  "linear-gradient(135deg, oklch(0.55 0.13 160 / 0.5), oklch(0.42 0.16 240 / 0.55))",
  rose:    "linear-gradient(135deg, oklch(0.7 0.18 350 / 0.55), oklch(0.5 0.18 300 / 0.55))",
  midnight:"linear-gradient(135deg, oklch(0.35 0.12 280 / 0.7), oklch(0.25 0.08 240 / 0.7))",
  paper:   "linear-gradient(135deg, oklch(0.7 0.1 80 / 0.45), oklch(0.55 0.15 320 / 0.5))",
  glass:   "linear-gradient(135deg, oklch(0.6 0.14 200 / 0.5), oklch(0.5 0.18 290 / 0.5))",
};

export const EXPERIENCES: Experience[] = [
  // CREATIVE
  { slug: "golden-hour-walk",
    title: "A slow walk through golden hour",
    description: "Photograph reflections, shadows, and the quiet details others walk past.",
    reasoning: "Sensory walks return space to a crowded mind.",
    category: "creative", vibe: "Creative Spark", energy: 2, social: 1,
    bestTimes: ["golden_hour", "evening"], weather: "sunny",
    moods: ["calm", "curious", "tender", "restless"], focusAreas: ["Creativity", "Mind"],
    durationMin: 45, gradient: G.dusk },

  { slug: "doodle-weather",
    title: "Doodle the weather inside you",
    description: "Three minutes, no rules. Draw what your mood looks like — clouds, lightning, fog, sun.",
    reasoning: "Tiny visual play softens emotional pressure without needing words.",
    category: "creative", vibe: "Quiet Curiosity", energy: 1, social: 0,
    bestTimes: ["morning", "evening", "night"], weather: "any",
    moods: ["heavy", "tender", "restless", "calm"], focusAreas: ["Creativity", "Heart"],
    durationMin: 5, gradient: G.paper },

  { slug: "single-frame-film",
    title: "Make a one-shot film of your evening",
    description: "Open your phone camera. Capture 30 seconds of the most cinematic thing in the room.",
    reasoning: "Reframing your space as a scene rebuilds wonder in the ordinary.",
    category: "creative", vibe: "Creative Spark", energy: 2, social: 0,
    bestTimes: ["evening", "night"], weather: "any",
    moods: ["curious", "restless", "hopeful"], focusAreas: ["Creativity"],
    durationMin: 10, gradient: G.midnight },

  { slug: "dance-one-song",
    title: "Dance to a single song",
    description: "Pick a song you love and move only to it. Lights low, no audience.",
    reasoning: "Brief embodied movement loosens emotional knots faster than thought.",
    category: "creative", vibe: "Soft Motivation", energy: 3, social: 0,
    bestTimes: ["morning", "evening", "night"], weather: "any",
    moods: ["heavy", "restless", "hopeful", "tender"], focusAreas: ["Body", "Heart"],
    durationMin: 4, gradient: G.rose },

  { slug: "story-from-stranger",
    title: "Invent a stranger's story",
    description: "Pick someone you saw today. Write a paragraph imagining their hidden chapter.",
    reasoning: "Empathy practice — quietly returns warmth to your view of the world.",
    category: "creative", vibe: "Quiet Curiosity", energy: 1, social: 0,
    bestTimes: ["evening", "night"], weather: "any",
    moods: ["calm", "curious", "tender"], focusAreas: ["Creativity", "Mind"],
    durationMin: 8, gradient: G.glass },

  // EMOTIONAL
  { slug: "sunset-reflection",
    title: "Watch a sunset without your phone",
    description: "Find a window or a corner of sky. Stay until the colors finish.",
    reasoning: "Letting time pass uninterrupted re-anchors a restless nervous system.",
    category: "emotional", vibe: "Calm Evening", energy: 1, social: 0,
    bestTimes: ["golden_hour", "evening"], weather: "any",
    moods: ["heavy", "restless", "tender", "calm"], focusAreas: ["Heart", "Mind"],
    durationMin: 15, gradient: G.dusk },

  { slug: "letter-to-past-self",
    title: "Write a letter to a past version of you",
    description: "One you remember being kinder to than you are to yourself now.",
    reasoning: "Self-tenderness is most accessible when aimed backward.",
    category: "emotional", vibe: "Tender Solitude", energy: 2, social: 0,
    bestTimes: ["evening", "night"], weather: "any",
    moods: ["heavy", "tender"], focusAreas: ["Heart"],
    durationMin: 15, gradient: G.rose },

  { slug: "tea-ritual",
    title: "Make tea like it matters",
    description: "Boil, pour, breathe over the steam, drink slow. Nothing else allowed.",
    reasoning: "A 7-minute ritual is enough to reset emotional pace.",
    category: "emotional", vibe: "Emotional Reset", energy: 1, social: 0,
    bestTimes: ["morning", "evening", "night"], weather: "any",
    moods: ["heavy", "restless", "calm"], focusAreas: ["Body", "Heart"],
    durationMin: 7, gradient: G.ember },

  { slug: "memory-album",
    title: "Open an old photo album, pick one moment",
    description: "Write three lines about what you remember the air felt like.",
    reasoning: "Re-touching small joys is a quiet rebellion against numbness.",
    category: "emotional", vibe: "Tender Solitude", energy: 1, social: 0,
    bestTimes: ["evening", "night"], weather: "any",
    moods: ["heavy", "tender", "calm"], focusAreas: ["Heart"],
    durationMin: 10, gradient: G.glass },

  { slug: "rain-listen",
    title: "Listen to rain (real or recorded) for 6 minutes",
    description: "No task. Just the texture of falling water.",
    reasoning: "Auditory softness lowers cortisol and sharpens self-awareness.",
    category: "emotional", vibe: "Calm Evening", energy: 1, social: 0,
    bestTimes: ["morning", "afternoon", "evening", "night"], weather: "rainy",
    moods: ["heavy", "tender", "restless"], focusAreas: ["Mind", "Body"],
    durationMin: 6, gradient: G.ocean },

  // SOCIAL
  { slug: "bookstore-wander",
    title: "Wander a bookstore with no goal",
    description: "Read first sentences. Leave with a photo of one cover that pulls you.",
    reasoning: "Low-pressure public space rekindles curiosity without demand.",
    category: "social", vibe: "Gentle Exploration", energy: 2, social: 1,
    bestTimes: ["afternoon", "evening"], weather: "any",
    moods: ["calm", "curious", "hopeful"], focusAreas: ["Mind", "Creativity"],
    durationMin: 40, gradient: G.paper },

  { slug: "cafe-window",
    title: "Sit by a café window",
    description: "Order something warm. Watch the street move while you stay still.",
    reasoning: "Quiet third places give your nervous system company without effort.",
    category: "social", vibe: "Calm Evening", energy: 1, social: 1,
    bestTimes: ["morning", "afternoon", "evening"], weather: "any",
    moods: ["heavy", "calm", "tender"], focusAreas: ["Heart", "Mind"],
    durationMin: 30, gradient: G.ember },

  { slug: "compliment-stranger",
    title: "Give one honest compliment to a stranger",
    description: "Earrings, a laugh, the way they hold a book. Then leave.",
    reasoning: "Tiny generosity rewires self-perception faster than self-talk.",
    category: "social", vibe: "Soft Motivation", energy: 3, social: 2,
    bestTimes: ["afternoon", "evening"], weather: "any",
    moods: ["hopeful", "curious"], focusAreas: ["Relationships", "Heart"],
    durationMin: 5, gradient: G.rose },

  { slug: "reach-out-old-friend",
    title: "Send a 'thinking of you' to one old friend",
    description: "No update. No question. Just: I remembered you today and it warmed me.",
    reasoning: "Warm signals to dormant ties tend to bounce back as belonging.",
    category: "social", vibe: "Soft Motivation", energy: 2, social: 1,
    bestTimes: ["morning", "afternoon", "evening", "night"], weather: "any",
    moods: ["tender", "hopeful", "heavy"], focusAreas: ["Relationships"],
    durationMin: 4, gradient: G.glass },

  // ADVENTURE
  { slug: "unfamiliar-street",
    title: "Walk one street you've never walked",
    description: "Within 10 minutes of home. Let it lead. Notice what's new.",
    reasoning: "Tiny novelty cures emotional flatness without big effort.",
    category: "adventure", vibe: "Gentle Exploration", energy: 3, social: 1,
    bestTimes: ["afternoon", "evening", "golden_hour"], weather: "any",
    moods: ["calm", "curious", "restless"], focusAreas: ["Mind", "Creativity"],
    durationMin: 25, gradient: G.forest },

  { slug: "different-route-home",
    title: "Take the wrong way home on purpose",
    description: "Pick a turn you usually skip. Photograph the first thing that surprises you.",
    reasoning: "Even tiny detours interrupt autopilot and revive presence.",
    category: "adventure", vibe: "Quiet Curiosity", energy: 2, social: 1,
    bestTimes: ["afternoon", "evening"], weather: "any",
    moods: ["calm", "curious", "restless", "hopeful"], focusAreas: ["Mind"],
    durationMin: 15, gradient: G.dusk },

  { slug: "rooftop-or-hill",
    title: "Find higher ground at dusk",
    description: "A rooftop, hill, parking deck, anywhere the horizon is wider than usual.",
    reasoning: "Wider visual fields literally widen emotional perspective.",
    category: "adventure", vibe: "Restless Creativity", energy: 4, social: 0,
    bestTimes: ["golden_hour", "evening"], weather: "any",
    moods: ["restless", "hopeful", "curious"], focusAreas: ["Mind", "Heart"],
    durationMin: 35, gradient: G.midnight },

  { slug: "midnight-snack-hunt",
    title: "Go find one good thing to eat after dark",
    description: "Somewhere you've never tried. Sit and eat slowly.",
    reasoning: "Low-stakes nighttime adventure restores playfulness.",
    category: "adventure", vibe: "Gentle Exploration", energy: 3, social: 1,
    bestTimes: ["night"], weather: "any",
    moods: ["restless", "curious", "hopeful"], focusAreas: ["Body", "Creativity"],
    durationMin: 60, gradient: G.ember },

  { slug: "morning-light-hunt",
    title: "Chase the first hour of light",
    description: "Step outside before the city is loud. Walk until the sun is fully up.",
    reasoning: "Morning light + movement is the most reliable mood reset there is.",
    category: "adventure", vibe: "Soft Motivation", energy: 4, social: 0,
    bestTimes: ["morning"], weather: "any",
    moods: ["heavy", "calm", "hopeful", "restless"], focusAreas: ["Body", "Mind"],
    durationMin: 30, gradient: G.ocean },
];

export const CATEGORY_META: Record<ExperienceCategory, { label: string; tagline: string; tint: string }> = {
  creative:  { label: "Creative",  tagline: "Make something tiny and alive.", tint: "oklch(0.85 0.18 320)" },
  emotional: { label: "Emotional", tagline: "Quiet rituals to reset within.", tint: "oklch(0.82 0.15 200)" },
  social:    { label: "Social",    tagline: "Gentle ways to be among others.", tint: "oklch(0.82 0.18 50)" },
  adventure: { label: "Adventure", tagline: "Small detours from the ordinary.", tint: "oklch(0.78 0.16 295)" },
};
