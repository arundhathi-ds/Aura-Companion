export type CreativityCategory = "photography" | "painting" | "dance" | "writing" | "music";

export type CreativityMeta = {
  key: CreativityCategory;
  label: string;
  tagline: string;
  tint: string;
  gradient: string;
  prompts: string[];
};

export const CREATIVITY: Record<CreativityCategory, CreativityMeta> = {
  photography: {
    key: "photography",
    label: "Photography",
    tagline: "Catch the light no one else noticed.",
    tint: "oklch(0.82 0.18 50)",
    gradient: "linear-gradient(135deg, oklch(0.65 0.2 50 / 0.55), oklch(0.55 0.2 320 / 0.5))",
    prompts: [
      "Photograph three reflections you walk past every day.",
      "Capture a stranger's silhouette without their face.",
      "Find the most cinematic corner of your home and frame it.",
      "Shoot one image where the shadow is the subject, not the object.",
      "Document the last hour of light without moving more than 50 steps.",
      "Find a color that matches your mood today and follow it for 10 minutes.",
    ],
  },
  painting: {
    key: "painting",
    label: "Painting",
    tagline: "Color is a softer language for what's inside.",
    tint: "oklch(0.85 0.18 320)",
    gradient: "linear-gradient(135deg, oklch(0.7 0.18 350 / 0.55), oklch(0.5 0.18 300 / 0.55))",
    prompts: [
      "Paint your mood as weather — no figures, only atmosphere.",
      "Use only two colors and one feeling.",
      "Paint the room you wish existed inside you.",
      "Make a small piece with your non-dominant hand.",
      "Mix a color you've never named, then build a small world around it.",
    ],
  },
  dance: {
    key: "dance",
    label: "Dance",
    tagline: "Let the body say what the mouth can't.",
    tint: "oklch(0.78 0.16 295)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 30 / 0.55), oklch(0.45 0.2 295 / 0.55))",
    prompts: [
      "Pick one song. Move only with your hands and shoulders.",
      "Dance in slow motion to a fast song.",
      "Choose a song from when you were 14. Move how that version of you would.",
      "Lights off. Free-form for 4 minutes. No mirrors.",
      "Translate one emotion into one repeating gesture.",
    ],
  },
  writing: {
    key: "writing",
    label: "Writing",
    tagline: "Six lines is enough to find yourself.",
    tint: "oklch(0.82 0.15 200)",
    gradient: "linear-gradient(135deg, oklch(0.6 0.14 200 / 0.5), oklch(0.5 0.18 290 / 0.5))",
    prompts: [
      "Write a paragraph beginning with: 'The thing I haven't said out loud is…'",
      "Describe today as if it were a small room. What's in it?",
      "Invent a stranger's hidden chapter from one detail you saw today.",
      "Write a letter from the version of you in five years.",
      "List ten tiny beautiful things you noticed this week.",
    ],
  },
  music: {
    key: "music",
    label: "Music",
    tagline: "Sound makes a room for feelings to sit in.",
    tint: "oklch(0.82 0.15 200)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.16 220 / 0.55), oklch(0.45 0.18 280 / 0.55))",
    prompts: [
      "Build a 5-song playlist that maps your day so far.",
      "Hum or whistle a melody that matches your mood for 60 seconds.",
      "Pick one instrument sound. Listen to a track that features only it.",
      "Find one song you've never heard. Listen with eyes closed.",
      "Make a tiny voice memo singing or speaking what you can't say out loud.",
    ],
  },
};

export const CREATIVITY_LIST = Object.values(CREATIVITY);

export function pickPrompt(cat: CreativityCategory, seed?: string): string {
  const list = CREATIVITY[cat].prompts;
  if (!seed) return list[Math.floor(Math.random() * list.length)];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}