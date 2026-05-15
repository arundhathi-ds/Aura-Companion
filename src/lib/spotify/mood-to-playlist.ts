/**
 * mood-to-playlist.ts
 * Maps Aura mood tags to Spotify search terms for playlist discovery.
 */

export type AuraMood =
  | "calm"
  | "curious"
  | "heavy"
  | "hopeful"
  | "restless"
  | "tender";

export const MOOD_TO_SPOTIFY_QUERY: Record<AuraMood, string> = {
  calm:     "calm ambient focus meditation",
  curious:  "curious indie exploration cinematic",
  heavy:    "gentle sad healing soft piano",
  hopeful:  "hopeful uplifting morning acoustic",
  restless: "energetic beats flow electronic",
  tender:   "tender acoustic soft emotional",
};

export const MOOD_TO_LABEL: Record<AuraMood, string> = {
  calm:     "Calm & Focused",
  curious:  "Curious & Exploring",
  heavy:    "Gentle & Healing",
  hopeful:  "Hopeful & Rising",
  restless: "Energised & Moving",
  tender:   "Tender & Soft",
};

export function getMoodQuery(mood?: string | null): string {
  if (!mood) return "ambient focus";
  return MOOD_TO_SPOTIFY_QUERY[mood.toLowerCase() as AuraMood] ?? "ambient focus";
}

export function getMoodLabel(mood?: string | null): string {
  if (!mood) return "Your Current Vibe";
  return MOOD_TO_LABEL[mood.toLowerCase() as AuraMood] ?? "Your Current Vibe";
}
