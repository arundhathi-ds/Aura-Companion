/**
 * Placeholder catalog of meaningful places for Discover.
 * Real implementation will fetch from Google Places API + Weather API.
 * Keep `Place` shape stable.
 */
export type PlaceKind = "cafe" | "bookstore" | "library" | "beach" | "park" | "gallery" | "workshop" | "hidden";

export type Place = {
  slug: string;
  name: string;
  kind: PlaceKind;
  vibe: string;          // emotional one-liner
  description: string;
  distanceLabel: string; // "12 min walk" — placeholder until geo
  bestFor: string[];     // moods / vibes it serves
  gradient: string;
};

const G = {
  warm:   "linear-gradient(135deg, oklch(0.65 0.2 50 / 0.5), oklch(0.5 0.18 320 / 0.5))",
  paper:  "linear-gradient(135deg, oklch(0.7 0.1 80 / 0.45), oklch(0.55 0.15 320 / 0.5))",
  ocean:  "linear-gradient(135deg, oklch(0.55 0.16 220 / 0.55), oklch(0.45 0.18 280 / 0.55))",
  forest: "linear-gradient(135deg, oklch(0.55 0.13 160 / 0.5), oklch(0.42 0.16 240 / 0.55))",
  rose:   "linear-gradient(135deg, oklch(0.7 0.18 350 / 0.55), oklch(0.5 0.18 300 / 0.55))",
};

export const KIND_META: Record<PlaceKind, { label: string; icon: string }> = {
  cafe:      { label: "Cafés",         icon: "☕" },
  bookstore: { label: "Bookstores",    icon: "📚" },
  library:   { label: "Libraries",     icon: "🕯" },
  beach:     { label: "Beaches",       icon: "🌊" },
  park:      { label: "Parks",         icon: "🌿" },
  gallery:   { label: "Galleries",     icon: "🖼" },
  workshop:  { label: "Workshops",     icon: "✦" },
  hidden:    { label: "Hidden places", icon: "✺" },
};

export const PLACES: Place[] = [
  { slug: "lantern-cafe", name: "The Lantern Café", kind: "cafe",
    vibe: "Warm windows, slow espresso", description: "A corner café with low lights and tall windows perfect for a long sit.",
    distanceLabel: "12 min walk", bestFor: ["calm", "tender"], gradient: G.warm },
  { slug: "second-shelf", name: "Second Shelf Books", kind: "bookstore",
    vibe: "Smell of old paper", description: "Independent bookstore with reading nooks and a poetry corner.",
    distanceLabel: "8 min walk", bestFor: ["curious", "calm"], gradient: G.paper },
  { slug: "river-library", name: "River Branch Library", kind: "library",
    vibe: "Cathedral-quiet", description: "High ceilings, river-facing seats, perfect for solitude and writing.",
    distanceLabel: "20 min", bestFor: ["heavy", "tender"], gradient: G.ocean },
  { slug: "moonlit-cove", name: "Moonlit Cove", kind: "beach",
    vibe: "Wide sky, soft sand", description: "A small beach that feels emptier at dusk. Bring a notebook.",
    distanceLabel: "35 min drive", bestFor: ["restless", "hopeful"], gradient: G.ocean },
  { slug: "fern-park", name: "Fern Hollow Park", kind: "park",
    vibe: "Green hush", description: "Old trees and a quiet bench by a small pond. Great for slow walks.",
    distanceLabel: "10 min walk", bestFor: ["heavy", "calm"], gradient: G.forest },
  { slug: "amber-gallery", name: "Amber Gallery", kind: "gallery",
    vibe: "Soft sound, slow art", description: "Rotating exhibitions of contemporary photography.",
    distanceLabel: "18 min", bestFor: ["curious", "creative"], gradient: G.rose },
  { slug: "clay-studio", name: "Hands & Clay Studio", kind: "workshop",
    vibe: "Mud, music, no judgment", description: "Drop-in pottery sessions on weekday evenings.",
    distanceLabel: "25 min", bestFor: ["restless", "creative"], gradient: G.warm },
  { slug: "rooftop-stairs", name: "The Old Mill Rooftop", kind: "hidden",
    vibe: "A wider horizon", description: "A semi-public rooftop most people walk past. Best at golden hour.",
    distanceLabel: "15 min", bestFor: ["restless", "hopeful"], gradient: G.rose },
];

/**
 * --- Future API integration surface (placeholder) ---
 * These functions are stubs ready to be wired to:
 *  - Google Places API (lat/lng, types)
 *  - OpenWeather API   (current weather → filter recommendations)
 *  - YouTube API       (ambient/companion videos for an experience)
 * For now they just return our local catalog so the UI works end-to-end.
 */
export async function fetchNearbyPlaces(_opts?: { lat?: number; lng?: number; kind?: PlaceKind }) {
  return PLACES;
}
