/**
 * Step-by-step guidance for each experience. Falls back to a generic
 * 3-step ritual if a slug isn't listed here.
 */

export type ExperienceStep = {
  title: string;
  detail: string;
  // suggested seconds for this step (optional). If undefined, no countdown.
  seconds?: number;
};

const GENERIC: ExperienceStep[] = [
  { title: "Arrive", detail: "Take three slow breaths. Let the room come to meet you.", seconds: 60 },
  { title: "Be inside it", detail: "Move into the experience without judgment. Let it unfold.", seconds: 300 },
  { title: "Notice what shifted", detail: "Pause. Notice one small thing that feels different now.", seconds: 60 },
];

const STEPS: Record<string, ExperienceStep[]> = {
  "golden-hour-walk": [
    { title: "Step outside", detail: "Leave your phone in your pocket. Notice the temperature on your skin.", seconds: 60 },
    { title: "Find a slow rhythm", detail: "Walk at half your usual pace. Let the light lead you.", seconds: 600 },
    { title: "Photograph one thing", detail: "Pick one shadow, one reflection, one detail others would miss.", seconds: 120 },
    { title: "Stay until it's gone", detail: "Watch the gold fade into blue. Let the sky finish first.", seconds: 600 },
  ],
  "doodle-weather": [
    { title: "Pick paper or screen", detail: "Anything you can draw on. No good materials needed.", seconds: 30 },
    { title: "Close your eyes", detail: "What does today look like as weather inside you?", seconds: 30 },
    { title: "Three minutes of marks", detail: "Lines, clouds, lightning, fog, sun — no rules.", seconds: 180 },
  ],
  "tea-ritual": [
    { title: "Boil with attention", detail: "Watch the water move. Listen for it.", seconds: 180 },
    { title: "Pour slowly", detail: "Notice the steam rising into your face.", seconds: 30 },
    { title: "Breathe over the cup", detail: "Three breaths before the first sip.", seconds: 60 },
    { title: "Drink without doing anything else", detail: "No phone, no book. Just you and the warmth.", seconds: 240 },
  ],
  "letter-to-past-self": [
    { title: "Pick a version of you", detail: "Choose an age you remember being kinder to than you are now.", seconds: 120 },
    { title: "Write what they needed to hear", detail: "From the safety of where you are, tell them.", seconds: 600 },
    { title: "Sign with tenderness", detail: "Close it like a real letter. Read it once. Keep it.", seconds: 60 },
  ],
  "sunset-reflection": [
    { title: "Find a window or a sky", detail: "A patch of horizon, even between buildings, will do.", seconds: 60 },
    { title: "Stay until colors finish", detail: "Don't leave when it gets boring. The boring part is the point.", seconds: 720 },
    { title: "Name one feeling", detail: "Just one word for what's left in you.", seconds: 60 },
  ],
  "rain-listen": [
    { title: "Open a window or a track", detail: "Real rain or a recording. Both count.", seconds: 30 },
    { title: "Close your eyes", detail: "Let the sound be the only task you have.", seconds: 360 },
  ],
  "dance-one-song": [
    { title: "Pick the song", detail: "One you love. Lights low, no audience.", seconds: 30 },
    { title: "Move with it", detail: "However your body wants. Eyes closed if it helps.", seconds: 240 },
    { title: "Stand still after", detail: "Feel where the music landed in you.", seconds: 30 },
  ],
};

export function stepsFor(slug: string): ExperienceStep[] {
  return STEPS[slug] ?? GENERIC;
}