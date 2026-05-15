/**
 * curated-playlists.ts
 * Handpicked Spotify playlists mapped to each Aura mood.
 * No API required — these are public Spotify playlists that open directly.
 */

export type CuratedPlaylist = {
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  /** Mood-tinted gradient used as cover art background */
  gradient: string;
  trackCount: number;
};

export type AuraMood =
  | "calm"
  | "curious"
  | "heavy"
  | "hopeful"
  | "restless"
  | "tender";

export const MOOD_LABEL: Record<AuraMood, string> = {
  calm:     "Calm & Focused",
  curious:  "Curious & Exploring",
  heavy:    "Gentle & Healing",
  hopeful:  "Hopeful & Rising",
  restless: "Energised & Moving",
  tender:   "Tender & Soft",
};

const PLAYLISTS: Record<AuraMood, CuratedPlaylist[]> = {
  calm: [
    {
      id: "37i9dQZF1DX4sWSpwq3LiO",
      name: "Peaceful Piano",
      description: "Relax and indulge with beautiful piano pieces",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      gradient: "linear-gradient(135deg, oklch(0.55 0.16 220 / 0.7), oklch(0.45 0.18 280 / 0.7))",
      trackCount: 141,
    },
    {
      id: "37i9dQZF1DWZeKCadgRdKQ",
      name: "Deep Focus",
      description: "Keep calm and focus with ambient and post-rock music",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
      gradient: "linear-gradient(135deg, oklch(0.5 0.13 200 / 0.7), oklch(0.4 0.1 260 / 0.7))",
      trackCount: 204,
    },
    {
      id: "37i9dQZF1DX1s9knjAYDmy",
      name: "Ambient Chill",
      description: "Slow, gentle ambient sounds to bring stillness",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX1s9knjAYDmy",
      gradient: "linear-gradient(135deg, oklch(0.6 0.1 200 / 0.7), oklch(0.5 0.12 240 / 0.7))",
      trackCount: 97,
    },
  ],

  curious: [
    {
      id: "37i9dQZF1DX4UtSsGT1Sk6",
      name: "Indie Folk",
      description: "Thoughtful, story-driven indie folk",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4UtSsGT1Sk6",
      gradient: "linear-gradient(135deg, oklch(0.65 0.15 120 / 0.7), oklch(0.5 0.18 280 / 0.6))",
      trackCount: 100,
    },
    {
      id: "37i9dQZF1DX8Uebhn9xrqM",
      name: "Cinematic Chill",
      description: "Evocative soundscapes for wandering minds",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9xrqM",
      gradient: "linear-gradient(135deg, oklch(0.55 0.14 260 / 0.7), oklch(0.45 0.12 300 / 0.7))",
      trackCount: 88,
    },
    {
      id: "37i9dQZF1DXbrUpGvoi3TS",
      name: "Lo-Fi Beats",
      description: "Chill beats to study and explore to",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXbrUpGvoi3TS",
      gradient: "linear-gradient(135deg, oklch(0.7 0.1 80 / 0.7), oklch(0.55 0.15 320 / 0.6))",
      trackCount: 130,
    },
  ],

  heavy: [
    {
      id: "37i9dQZF1DX7gIoKXt0gmx",
      name: "Sad Songs",
      description: "Beautiful songs to feel seen and less alone",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gmx",
      gradient: "linear-gradient(135deg, oklch(0.45 0.08 280 / 0.7), oklch(0.35 0.06 260 / 0.7))",
      trackCount: 100,
    },
    {
      id: "37i9dQZF1DX9XIFQuFvzM4",
      name: "Healing",
      description: "Songs that hold you while you recover",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX9XIFQuFvzM4",
      gradient: "linear-gradient(135deg, oklch(0.65 0.1 350 / 0.6), oklch(0.5 0.1 300 / 0.7))",
      trackCount: 75,
    },
    {
      id: "37i9dQZF1DWZd79rJ6a7lp",
      name: "Sleep",
      description: "Gentle music to ease a heavy mind to rest",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp",
      gradient: "linear-gradient(135deg, oklch(0.4 0.08 240 / 0.7), oklch(0.3 0.06 280 / 0.7))",
      trackCount: 161,
    },
  ],

  hopeful: [
    {
      id: "37i9dQZF1DX3rxVfibe1L0",
      name: "Mood Booster",
      description: "Feel-good songs to lift your spirit",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
      gradient: "linear-gradient(135deg, oklch(0.75 0.2 60 / 0.7), oklch(0.65 0.18 320 / 0.6))",
      trackCount: 100,
    },
    {
      id: "37i9dQZF1DX76Wlfdnj7AP",
      name: "Morning Motivation",
      description: "Rise with intention and warmth",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
      gradient: "linear-gradient(135deg, oklch(0.8 0.16 50 / 0.7), oklch(0.7 0.18 30 / 0.6))",
      trackCount: 87,
    },
    {
      id: "37i9dQZF1DXdPec7aLTmlC",
      name: "Happy Hits",
      description: "Hits to keep you smiling and moving forward",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
      gradient: "linear-gradient(135deg, oklch(0.82 0.15 80 / 0.7), oklch(0.72 0.2 40 / 0.6))",
      trackCount: 120,
    },
  ],

  restless: [
    {
      id: "37i9dQZF1DWUZv12GM5cFk",
      name: "Beast Mode",
      description: "Intense beats to burn the restless energy",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWUZv12GM5cFk",
      gradient: "linear-gradient(135deg, oklch(0.6 0.22 25 / 0.7), oklch(0.5 0.2 295 / 0.7))",
      trackCount: 100,
    },
    {
      id: "37i9dQZF1DWXti3N4Wp5xy",
      name: "Energy Booster",
      description: "High-energy tracks to channel your intensity",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWXti3N4Wp5xy",
      gradient: "linear-gradient(135deg, oklch(0.65 0.2 295 / 0.7), oklch(0.55 0.22 320 / 0.7))",
      trackCount: 109,
    },
    {
      id: "37i9dQZF1DX0BcQWzuB7ZO",
      name: "Dance Hits",
      description: "Move through the restlessness with rhythm",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX0BcQWzuB7ZO",
      gradient: "linear-gradient(135deg, oklch(0.7 0.2 310 / 0.7), oklch(0.6 0.2 270 / 0.7))",
      trackCount: 100,
    },
  ],

  tender: [
    {
      id: "37i9dQZF1DX1muKAhAtqQh",
      name: "Acoustic Covers",
      description: "Familiar songs made soft and close",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX1muKAhAtqQh",
      gradient: "linear-gradient(135deg, oklch(0.75 0.15 350 / 0.7), oklch(0.65 0.12 320 / 0.6))",
      trackCount: 157,
    },
    {
      id: "37i9dQZF1DXcBWIGoYBM5T",
      name: "Soft Pop Hits",
      description: "Gentle pop for when you're holding something fragile",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5T",
      gradient: "linear-gradient(135deg, oklch(0.8 0.12 340 / 0.7), oklch(0.7 0.15 300 / 0.6))",
      trackCount: 100,
    },
    {
      id: "37i9dQZF1DX50QitC6Oqtn",
      name: "Love Songs",
      description: "Songs that hold tenderness without demands",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX50QitC6Oqtn",
      gradient: "linear-gradient(135deg, oklch(0.72 0.18 350 / 0.7), oklch(0.6 0.16 330 / 0.6))",
      trackCount: 100,
    },
  ],
};

export function getPlaylistsForMood(mood?: string | null): CuratedPlaylist[] {
  if (!mood) return PLAYLISTS.calm;
  return PLAYLISTS[mood.toLowerCase() as AuraMood] ?? PLAYLISTS.calm;
}

export function getMoodLabel(mood?: string | null): string {
  if (!mood) return "Curated for your vibe";
  return MOOD_LABEL[mood.toLowerCase() as AuraMood] ?? "Curated for your vibe";
}
