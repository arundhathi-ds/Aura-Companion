export type CreativityCategory =
  | "photography"
  | "painting"
  | "dance"
  | "writing"
  | "music"
  | "film"
  | "midnight-walks"
  | "memory-room"
  | "soundscape";

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
      "Tonight the light is hiding in corners. Find one thing that feels luminous and frame it in words.",
      "Photograph a quiet moment by describing the color of the shadows around it.",
      "Capture a reflection without yourself in it, then tell the story of what it keeps.",
      "Find one light that feels lonely. Write the memory it wants to hold.",
      "Notice the way a small room breathes as the hour changes.",
    ],
  },
  painting: {
    key: "painting",
    label: "Painting",
    tagline: "Color is a softer language for what's inside.",
    tint: "oklch(0.85 0.18 320)",
    gradient: "linear-gradient(135deg, oklch(0.7 0.18 350 / 0.55), oklch(0.5 0.18 300 / 0.55))",
    prompts: [
      "Mix a color for the weather in your chest. Give it a name and let it lead.",
      "Paint a shape from memory, not from sight.",
      "Use only two colors and the feeling of late evening.",
      "Make a small gesture on the page that feels like forgiveness.",
      "Let one quiet moment become your entire composition.",
    ],
  },
  dance: {
    key: "dance",
    label: "Dance",
    tagline: "Let the body say what the mouth can't.",
    tint: "oklch(0.78 0.16 295)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 30 / 0.55), oklch(0.45 0.2 295 / 0.55))",
    prompts: [
      "Move only one part of your body for a full minute. Listen to how it changes.",
      "Let the floor support half your weight and move from there.",
      "Find a feeling and give it a shape with your arms.",
      "Slow down a fast song until its heartbeat feels intimate.",
      "Follow the rhythm of your own breath instead of the music.",
    ],
  },
  writing: {
    key: "writing",
    label: "Writing",
    tagline: "Six lines is enough to find yourself.",
    tint: "oklch(0.82 0.15 200)",
    gradient: "linear-gradient(135deg, oklch(0.6 0.14 200 / 0.5), oklch(0.5 0.18 290 / 0.5))",
    prompts: [
      "Write six lines that sound like rain remembering someone.",
      "Begin with: 'Tonight I noticed…' and follow where the sentence opens.",
      "Describe a person using only sounds and weather.",
      "Write a quiet letter to a moment you are leaving behind.",
      "Tell the story of one small thing that stayed with you today.",
    ],
  },
  music: {
    key: "music",
    label: "Music",
    tagline: "Sound makes a room for feelings to sit in.",
    tint: "oklch(0.82 0.15 200)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.16 220 / 0.55), oklch(0.45 0.18 280 / 0.55))",
    prompts: [
      "Listen to a song as if it were a place you are walking through.",
      "Find three sounds in the room and let them become a gentle pattern.",
      "Hum a melody that feels like the night settling in.",
      "Choose one instrument and follow it with your attention.",
      "Describe the first sound you hear after you close your eyes.",
    ],
  },
  film: {
    key: "film",
    label: "Film",
    tagline: "Watch emotions move through light and shadow.",
    tint: "oklch(0.7 0.16 230)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 220 / 0.55), oklch(0.45 0.16 280 / 0.55))",
    prompts: [
      "Describe one scene like it is the opening shot of a quiet film.",
      "Choose a color, a sound, and a gesture that belong together in the scene.",
      "Write the first line of dialogue from an inner world.",
      "Observe a passing moment and place it in a dark room with one light.",
      "See one memory as if it were a short film. What does it look like?",
    ],
  },
  "midnight-walks": {
    key: "midnight-walks",
    label: "Midnight Walks",
    tagline: "Walk the city like a poem at night.",
    tint: "oklch(0.48 0.18 220)",
    gradient: "linear-gradient(135deg, oklch(0.24 0.20 240 / 0.65), oklch(0.12 0.08 280 / 0.55))",
    prompts: [
      "Find one street that feels like a hidden line of poetry.",
      "Notice a window light that seems to be waiting for you.",
      "Hear the rhythm of your steps and let it guide a quiet thought.",
      "Let the air carry one small memory from the night.",
      "Write the shade of a single street lamp as if it were an emotion.",
    ],
  },
  "memory-room": {
    key: "memory-room",
    label: "Memory Room",
    tagline: "A gentle space for forgotten moments to come home.",
    tint: "oklch(0.74 0.14 330)",
    gradient: "linear-gradient(135deg, oklch(0.55 0.14 330 / 0.6), oklch(0.33 0.14 280 / 0.5))",
    prompts: [
      "Recall one small detail from a memory you haven't visited in a while.",
      "Describe the way light moved in a room you once loved.",
      "Find the quiet edge of an old conversation and let it return.",
      "Name one feeling from a forgotten afternoon.",
      "Write the title of a memory that feels ready to be held again.",
    ],
  },
  soundscape: {
    key: "soundscape",
    label: "Soundscape",
    tagline: "Turn the world into a layered, listening space.",
    tint: "oklch(0.68 0.18 180)",
    gradient: "linear-gradient(135deg, oklch(0.45 0.16 200 / 0.55), oklch(0.28 0.14 250 / 0.55))",
    prompts: [
      "Close your eyes and find three layers of sound around you.",
      "Listen to the room as if it were a soft painting.",
      "Describe the texture of the night using only sound words.",
      "Let one hum, one rustle, and one silence become a small composition.",
      "Notice how the space changes when you listen more than speak.",
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
