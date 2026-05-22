export type CategoryProfile = {
  key: string;
  label: string;
  description?: string;
  emotion?: string;
  seed_genres: string[];
  seed_artists?: string[];
  audioTargets: Partial<
    Record<
      "energy" | "valence" | "danceability" | "acousticness" | "instrumentalness" | "tempo",
      number
    >
  >;
  visual?: { gradient?: string; tint?: string };
  companionLine?: string;
};

export const CATEGORIES: CategoryProfile[] = [
  // FOCUS & PRODUCTIVITY
  {
    key: "deep-focus",
    label: "Deep Focus",
    emotion: "Intense Concentration",
    description: "Steady, minimal, immersive",
    seed_genres: ["ambient", "modern-classical", "minimal-techno", "neo-classical", "post-rock"],
    seed_artists: ["Max Richter", "Nils Frahm", "Ólafur Arnalds", "Jon Hopkins", "Tycho"],
    audioTargets: {
      energy: 0.22,
      valence: 0.1,
      danceability: 0.05,
      acousticness: 0.35,
      instrumentalness: 0.75,
      tempo: 60,
    },
    visual: { gradient: "linear-gradient(180deg,#0f172a,#021127)", tint: "#7dd3fc" },
    companionLine: "The room narrows. Attention widens.",
  },
  {
    key: "study-flow",
    label: "Study Flow",
    emotion: "Productive Calm",
    seed_genres: ["lofi", "chillhop", "instrumental hip hop", "piano", "jazz"],
    seed_artists: ["Ólafur Arnalds", "Snarky Puppy", "Ólafur Arnalds", "Chillwave", "Tomo Taro"],
    audioTargets: {
      energy: 0.32,
      valence: 0.28,
      danceability: 0.1,
      acousticness: 0.48,
      instrumentalness: 0.65,
      tempo: 75,
    },
    companionLine: "Learning feels gentle today.",
  },
  {
    key: "coding-night",
    label: "Coding Night",
    emotion: "Focused Energy",
    seed_genres: ["synthwave", "chillhop", "electronic", "lo-fi hip-hop", "dark-ambient"],
    seed_artists: ["Com Truise", "Kavinsky", "Perturbator", "Home", "Boards of Canada"],
    audioTargets: {
      energy: 0.42,
      valence: 0.22,
      danceability: 0.25,
      acousticness: 0.12,
      instrumentalness: 0.72,
      tempo: 95,
    },
    visual: { gradient: "linear-gradient(180deg,#1a1a2e,#16213e)", tint: "#00ff88" },
    companionLine: "The code speaks to you.",
  },
  {
    key: "quiet-concentration",
    label: "Quiet Concentration",
    emotion: "Serene Focus",
    seed_genres: ["ambient", "field-recording", "minimalism", "piano", "drone"],
    seed_artists: ["Erik Satie", "Alva Noto", "Ryoji Ikeda", "Nils Frahm", "Max Richter"],
    audioTargets: {
      energy: 0.15,
      valence: 0.12,
      danceability: 0.02,
      acousticness: 0.62,
      instrumentalness: 0.85,
      tempo: 50,
    },
    companionLine: "Silence has a voice.",
  },

  // EMOTIONAL ATMOSPHERES
  {
    key: "healing",
    label: "Healing",
    emotion: "Restorative",
    seed_genres: ["ambient", "singer-songwriter", "chillwave", "contemporary r&b", "soul"],
    seed_artists: [
      "Bon Iver",
      "Damien Rice",
      "Nora Jones",
      "The Tallest Man on Earth",
      "Novo Amor",
    ],
    audioTargets: {
      energy: 0.28,
      valence: 0.35,
      danceability: 0.12,
      acousticness: 0.62,
      instrumentalness: 0.4,
      tempo: 65,
    },
    visual: { gradient: "linear-gradient(180deg,#0a3a3a,#0f2e2e)", tint: "#6ee7b7" },
    companionLine: "You're healing. Let yourself feel it.",
  },
  {
    key: "nostalgia",
    label: "Nostalgia",
    emotion: "Bittersweet Memories",
    seed_genres: ["indie-pop", "indie-rock", "synth-pop", "retro", "lo-fi hip-hop"],
    seed_artists: ["The Smiths", "Cocteau Twins", "New Order", "Depeche Mode", "The xx"],
    audioTargets: {
      energy: 0.45,
      valence: 0.42,
      danceability: 0.32,
      acousticness: 0.28,
      instrumentalness: 0.08,
      tempo: 88,
    },
    visual: { gradient: "linear-gradient(180deg,#2d1b4e,#1a0f2e)", tint: "#c084fc" },
    companionLine: "The past still echoes.",
  },
  {
    key: "overthinking-hours",
    label: "Overthinking Hours",
    emotion: "Deep Introspection",
    seed_genres: ["dark-ambient", "post-rock", "shoegaze", "slowcore", "ambient"],
    seed_artists: [
      "Sigur Rós",
      "Godspeed You! Black Emperor",
      "Low Roar",
      "Nick Drake",
      "Elliott Smith",
    ],
    audioTargets: {
      energy: 0.25,
      valence: 0.18,
      danceability: 0.08,
      acousticness: 0.35,
      instrumentalness: 0.52,
      tempo: 70,
    },
    visual: { gradient: "linear-gradient(180deg,#1a1a2e,#0f0f23)", tint: "#9ca3af" },
    companionLine: "Your thoughts run deep tonight.",
  },
  {
    key: "lonely-night",
    label: "Lonely Night",
    emotion: "Solitary Reflection",
    seed_genres: ["r&b", "soul", "singer-songwriter", "indie-folk", "emo"],
    seed_artists: ["Frank Ocean", "John Legend", "Amy Winehouse", "Bon Iver", "The National"],
    audioTargets: {
      energy: 0.32,
      valence: 0.25,
      danceability: 0.15,
      acousticness: 0.5,
      instrumentalness: 0.15,
      tempo: 72,
    },
    visual: { gradient: "linear-gradient(180deg,#0b1f3a,#051219)", tint: "#475569" },
    companionLine: "You're not alone in this feeling.",
  },
  {
    key: "quiet-curiosity",
    label: "Quiet Curiosity",
    emotion: "Gentle Wonder",
    seed_genres: ["ambient", "indie-pop", "experimental", "electronic", "art-pop"],
    seed_artists: ["Sufjan Stevens", "Grimes", "Björk", "Imogen Heap", "Arca"],
    audioTargets: {
      energy: 0.35,
      valence: 0.38,
      danceability: 0.22,
      acousticness: 0.32,
      instrumentalness: 0.28,
      tempo: 78,
    },
    companionLine: "What wonders hide in the quiet?",
  },

  // ATMOSPHERIC
  {
    key: "rainy-window",
    label: "Rainy Window",
    emotion: "Melancholic Comfort",
    description: "Soft rain, reflective thoughts",
    seed_genres: ["ambient", "rainy-day", "chill", "downtempo", "contemporary classical"],
    seed_artists: ["Ólafur Arnalds", "Nils Frahm", "Clint Mansell", "Jon Hopkins", "Kiasmos"],
    audioTargets: {
      energy: 0.2,
      valence: 0.18,
      danceability: 0.06,
      acousticness: 0.55,
      instrumentalness: 0.68,
      tempo: 62,
    },
    visual: { gradient: "linear-gradient(180deg,#0b3a53,#042233)", tint: "#60a5fa" },
    companionLine: "The city feels quieter tonight.",
  },
  {
    key: "neon-city",
    label: "Neon City",
    emotion: "Electric Pulse",
    description: "Synthwave nights, neon streets",
    seed_genres: ["synthwave", "electronic", "vaporwave", "retro-wave", "darkwave"],
    seed_artists: ["Kavinsky", "Perturbator", "Com Truise", "Carpenter Brut", "VHS Head"],
    audioTargets: {
      energy: 0.72,
      valence: 0.44,
      danceability: 0.62,
      acousticness: 0.01,
      instrumentalness: 0.35,
      tempo: 115,
    },
    visual: { gradient: "linear-gradient(180deg,#3b0764,#0f172a)", tint: "#f472b6" },
    companionLine: "Neon streets hum in the distance.",
  },
  {
    key: "space-drift",
    label: "Space Drift",
    emotion: "Cosmic Wonder",
    seed_genres: ["ambient", "space-music", "electronic", "drone", "experimental"],
    seed_artists: ["Brian Eno", "Vangelis", "Ryoji Ikeda", "Tim Hecker", "Claire M Singer"],
    audioTargets: {
      energy: 0.26,
      valence: 0.2,
      danceability: 0.05,
      acousticness: 0.08,
      instrumentalness: 0.92,
      tempo: 55,
    },
    visual: { gradient: "linear-gradient(180deg,#0a0e27,#1a0f3a)", tint: "#a78bfa" },
    companionLine: "The universe breathes with you.",
  },
  {
    key: "coffee-shop",
    label: "Coffee Shop",
    emotion: "Cozy Ambience",
    seed_genres: ["acoustic", "indie-pop", "folk", "chillwave", "lofi hip-hop"],
    seed_artists: ["Iron & Wine", "José González", "Bon Iver", "Daughter", "Novo Amor"],
    audioTargets: {
      energy: 0.34,
      valence: 0.42,
      danceability: 0.18,
      acousticness: 0.68,
      instrumentalness: 0.35,
      tempo: 85,
    },
    visual: { gradient: "linear-gradient(180deg,#3a2e22,#1f1a16)", tint: "#d4945c" },
    companionLine: "A warm cup and softer thoughts.",
  },
  {
    key: "midnight-train",
    label: "Midnight Train",
    emotion: "Wanderlust Journey",
    seed_genres: ["folk", "americana", "indie-rock", "alt-country", "singer-songwriter"],
    seed_artists: [
      "Sturgill Simpson",
      "Jason Isbell",
      "Tyler Childers",
      "Colter Wall",
      "Whiskey Myers",
    ],
    audioTargets: {
      energy: 0.48,
      valence: 0.45,
      danceability: 0.28,
      acousticness: 0.62,
      instrumentalness: 0.12,
      tempo: 92,
    },
    companionLine: "Every mile carries you somewhere new.",
  },
  {
    key: "ocean-waves",
    label: "Ocean Waves",
    emotion: "Peaceful Infinite",
    seed_genres: ["ambient", "field-recording", "acoustic", "nature-ambient", "chillwave"],
    seed_artists: ["Nils Frahm", "Alva Noto", "Marisa Anderson", "Grouper", "William Fitzsimmons"],
    audioTargets: {
      energy: 0.18,
      valence: 0.24,
      danceability: 0.02,
      acousticness: 0.72,
      instrumentalness: 0.8,
      tempo: 58,
    },
    visual: { gradient: "linear-gradient(180deg,#0a2d3a,#061a26)", tint: "#2dd4bf" },
    companionLine: "The waves carry what words cannot.",
  },

  // ENERGY
  {
    key: "hyper-mode",
    label: "Hyper Mode",
    emotion: "Unstoppable Energy",
    description: "Electrifying pulse",
    seed_genres: ["edm", "electronic", "drum-and-bass", "electro-house", "future-bass"],
    seed_artists: ["Calvin Harris", "Deadmau5", "Skrillex", "Porter Robinson", "Flume"],
    audioTargets: {
      energy: 0.96,
      valence: 0.62,
      danceability: 0.88,
      acousticness: 0.0,
      instrumentalness: 0.08,
      tempo: 145,
    },
    visual: { gradient: "linear-gradient(180deg,#4c0519,#1a0a2e)", tint: "#ff006e" },
    companionLine: "You're carrying momentum right now.",
  },
  {
    key: "gym-beast",
    label: "Gym Beast",
    emotion: "Raw Power",
    seed_genres: ["hip-hop", "trap", "electronic", "bass", "pop"],
    seed_artists: ["Eminem", "Kanye West", "Travis Scott", "M.I.A.", "The Prodigy"],
    audioTargets: {
      energy: 0.88,
      valence: 0.55,
      danceability: 0.78,
      acousticness: 0.02,
      instrumentalness: 0.1,
      tempo: 130,
    },
    visual: { gradient: "linear-gradient(180deg,#2d0a3a,#1a0a2e)", tint: "#ff1744" },
    companionLine: "Push past your limits.",
  },
  {
    key: "late-night-energy",
    label: "Late Night Energy",
    emotion: "Electric Rebellion",
    seed_genres: ["synth-pop", "electronic", "dark-wave", "industrial", "alternative"],
    seed_artists: ["Depeche Mode", "Nine Inch Nails", "New Order", "The Killers", "CHVRCHES"],
    audioTargets: {
      energy: 0.68,
      valence: 0.48,
      danceability: 0.68,
      acousticness: 0.05,
      instrumentalness: 0.2,
      tempo: 118,
    },
    companionLine: "The night is alive with possibilities.",
  },
  {
    key: "morning-momentum",
    label: "Morning Momentum",
    emotion: "Fresh Start",
    seed_genres: ["indie-pop", "electronic", "pop", "synthwave", "alternative"],
    seed_artists: ["The Killers", "MGMT", "Tame Impala", "Phoenix", "Two Door Cinema Club"],
    audioTargets: {
      energy: 0.72,
      valence: 0.68,
      danceability: 0.62,
      acousticness: 0.15,
      instrumentalness: 0.22,
      tempo: 108,
    },
    visual: { gradient: "linear-gradient(180deg,#1a3a2e,#0f2520)", tint: "#10b981" },
    companionLine: "A new day, full of light.",
  },

  // SOCIAL
  {
    key: "road-trip",
    label: "Road Trip",
    emotion: "Adventurous Freedom",
    seed_genres: ["indie-rock", "rock", "alt-rock", "americana", "garage-rock"],
    seed_artists: [
      "The Strokes",
      "Kings of Leon",
      "Arctic Monkeys",
      "Jack White",
      "The Black Keys",
    ],
    audioTargets: {
      energy: 0.68,
      valence: 0.58,
      danceability: 0.55,
      acousticness: 0.22,
      instrumentalness: 0.08,
      tempo: 105,
    },
    visual: { gradient: "linear-gradient(180deg,#2e1810,#1a0f08)", tint: "#f59e0b" },
    companionLine: "The road calls to something in you.",
  },
  {
    key: "house-party",
    label: "House Party",
    emotion: "Euphoric Celebration",
    seed_genres: ["pop", "dance", "electronic", "hip-hop", "funk"],
    seed_artists: ["Dua Lipa", "The Weeknd", "Daft Punk", "Pharrell Williams", "Mark Ronson"],
    audioTargets: {
      energy: 0.85,
      valence: 0.72,
      danceability: 0.82,
      acousticness: 0.1,
      instrumentalness: 0.12,
      tempo: 125,
    },
    companionLine: "The night is young and so are you.",
  },
  {
    key: "chill-with-friends",
    label: "Chill With Friends",
    emotion: "Warm Connection",
    seed_genres: ["r&b", "soul", "neo-soul", "indie-pop", "chillwave"],
    seed_artists: ["Anderson .Paak", "Bruno Mars", "SZA", "Frank Ocean", "H.E.R."],
    audioTargets: {
      energy: 0.48,
      valence: 0.55,
      danceability: 0.45,
      acousticness: 0.35,
      instrumentalness: 0.18,
      tempo: 92,
    },
    visual: { gradient: "linear-gradient(180deg,#2a1a3a,#1a0f2e)", tint: "#ec4899" },
    companionLine: "Good company needs good music.",
  },
  {
    key: "romantic-evening",
    label: "Romantic Evening",
    emotion: "Intimate Tenderness",
    seed_genres: ["r&b", "soul", "slow-soul", "jazz", "singer-songwriter"],
    seed_artists: ["Marvin Gaye", "Amy Winehouse", "Erykah Badu", "John Legend", "Bruno Mars"],
    audioTargets: {
      energy: 0.32,
      valence: 0.58,
      danceability: 0.42,
      acousticness: 0.48,
      instrumentalness: 0.08,
      tempo: 88,
    },
    visual: { gradient: "linear-gradient(180deg,#3a1a2a,#2a0f1a)", tint: "#f472b6" },
    companionLine: "Two hearts, one song.",
  },

  // CINEMATIC
  {
    key: "movie-ending",
    label: "Movie Ending",
    emotion: "Bittersweet Closure",
    seed_genres: ["film-score", "contemporary classical", "orchestral", "ambient", "post-rock"],
    seed_artists: [
      "Hans Zimmer",
      "Trent Reznor",
      "Hildur Guðnadóttir",
      "John Williams",
      "Thomas Newman",
    ],
    audioTargets: {
      energy: 0.42,
      valence: 0.45,
      danceability: 0.12,
      acousticness: 0.28,
      instrumentalness: 0.78,
      tempo: 85,
    },
    companionLine: "The credits roll on this chapter.",
  },
  {
    key: "main-character-walk",
    label: "Main Character Walk",
    emotion: "Triumphant Presence",
    seed_genres: ["hip-hop", "electronic", "industrial", "alternative", "indie-rock"],
    seed_artists: [
      "Tyler, The Creator",
      "Kendrick Lamar",
      "Childish Gambino",
      "James Blake",
      "Radiohead",
    ],
    audioTargets: {
      energy: 0.62,
      valence: 0.52,
      danceability: 0.48,
      acousticness: 0.12,
      instrumentalness: 0.25,
      tempo: 102,
    },
    visual: { gradient: "linear-gradient(180deg,#1a1a2e,#0f172a)", tint: "#3b82f6" },
    companionLine: "You walk like you own this moment.",
  },
  {
    key: "cyberpunk-night",
    label: "Cyberpunk Night",
    emotion: "Dystopian Intensity",
    seed_genres: ["synthwave", "darkwave", "industrial", "electronic", "darksynth"],
    seed_artists: ["Perturbator", "Carpenter Brut", "Gost", "Magic Sword", "Danger"],
    audioTargets: {
      energy: 0.75,
      valence: 0.35,
      danceability: 0.55,
      acousticness: 0.02,
      instrumentalness: 0.4,
      tempo: 112,
    },
    visual: { gradient: "linear-gradient(180deg,#1a0a2e,#0d0013)", tint: "#00ff88" },
    companionLine: "Welcome to the neon underworld.",
  },
  {
    key: "slow-motion-memories",
    label: "Slow Motion Memories",
    emotion: "Nostalgic Contemplation",
    seed_genres: ["chillwave", "dream-pop", "indie-pop", "ambient", "shoegaze"],
    seed_artists: ["Beach House", "Warpaint", "Slowdive", "Alvvays", "Mac DeMarco"],
    audioTargets: {
      energy: 0.28,
      valence: 0.38,
      danceability: 0.18,
      acousticness: 0.32,
      instrumentalness: 0.38,
      tempo: 75,
    },
    visual: { gradient: "linear-gradient(180deg,#2d1b4e,#1a0f2e)", tint: "#d8b4fe" },
    companionLine: "Time slows when you truly feel.",
  },

  // ORIGINAL CATEGORIES (kept for compatibility)
  {
    key: "dreamy",
    label: "Dreamy",
    emotion: "Ethereal Wonder",
    seed_genres: ["dream-pop", "indie-pop", "shoegaze", "ambient", "chillwave"],
    seed_artists: ["Cocteau Twins", "Beach House", "Slowdive", "Alvvays", "Warpaint"],
    audioTargets: {
      energy: 0.35,
      valence: 0.42,
      danceability: 0.25,
      acousticness: 0.3,
      instrumentalness: 0.25,
      tempo: 82,
    },
    visual: { gradient: "linear-gradient(180deg,#1a1a3e,#0f172a)", tint: "#a78bfa" },
    companionLine: "Tonight feels distant and soft.",
  },
];

export function findCategoryByKey(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? null;
}

export function getRandomCategory(): CategoryProfile {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

const MOOD_CATEGORY_AFFINITY: Record<string, string[]> = {
  calm: [
    "rainy-window",
    "ocean-waves",
    "quiet-concentration",
    "healing",
    "space-drift",
    "coffee-shop",
  ],
  curious: ["quiet-curiosity", "space-drift", "midnight-train", "neon-city", "dreamy"],
  heavy: ["healing", "lonely-night", "overthinking-hours", "ocean-waves", "rainy-window"],
  hopeful: ["morning-momentum", "road-trip", "coffee-shop", "main-character-walk", "dreamy"],
  restless: ["hyper-mode", "late-night-energy", "neon-city", "cyberpunk-night", "gym-beast"],
  tender: ["romantic-evening", "slow-motion-memories", "healing", "coffee-shop", "nostalgia"],
};

export function pickCategoryForIntentWeather(
  intent: string,
  weather?: string,
  mood?: string,
): string {
  const i = intent?.toLowerCase() ?? "";
  const w = weather?.toLowerCase() ?? "";

  if (i.includes("focus") || i.includes("work") || i.includes("study")) {
    if (w.includes("code") || w.includes("program")) return "coding-night";
    if (w.includes("rain")) return "rainy-window";
    if (w.includes("quiet")) return "quiet-concentration";
    const options = ["deep-focus", "study-flow", "quiet-concentration"];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (i.includes("workout") || i.includes("gym") || i.includes("exercise")) {
    if (w.includes("morning")) return "morning-momentum";
    if (w.includes("night")) return "late-night-energy";
    const options = ["hyper-mode", "gym-beast", "morning-momentum"];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (i.includes("heal") || i.includes("calm")) return "healing";
  if (i.includes("sad") || i.includes("alone")) {
    const options = ["lonely-night", "overthinking-hours", "healing"];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (i.includes("nostalgic") || i.includes("remember")) return "nostalgia";
  if (i.includes("curious") || i.includes("wonder")) return "quiet-curiosity";
  if (i.includes("emotional") || i.includes("feel")) {
    const options = ["nostalgia", "slow-motion-memories", "overthinking-hours"];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (i.includes("rain")) return "rainy-window";
  if (i.includes("neon") || i.includes("city") || i.includes("night")) return "neon-city";
  if (i.includes("space") || i.includes("cosmic")) return "space-drift";
  if (i.includes("coffee") || i.includes("cafe")) return "coffee-shop";
  if (i.includes("ocean") || i.includes("beach")) return "ocean-waves";
  if (i.includes("train") || i.includes("travel") || i.includes("adventure"))
    return "midnight-train";

  if (i.includes("party") || i.includes("dance")) return "house-party";
  if (i.includes("friend") || i.includes("social")) return "chill-with-friends";
  if (i.includes("romantic") || i.includes("date")) return "romantic-evening";
  if (i.includes("road") || i.includes("trip") || i.includes("drive")) return "road-trip";

  if (i.includes("epic") || i.includes("hero") || i.includes("main character"))
    return "main-character-walk";
  if (i.includes("ending") || i.includes("closure")) return "movie-ending";
  if (i.includes("cyber") || i.includes("future")) return "cyberpunk-night";
  if (i.includes("memory") || i.includes("slow")) return "slow-motion-memories";
  if (i.includes("chill")) {
    const options = ["coffee-shop", "chill-with-friends", "dreamy", "rainy-window"];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (mood) {
    const moodCategories = MOOD_CATEGORY_AFFINITY[mood.toLowerCase()];
    if (moodCategories && moodCategories.length > 0) {
      return moodCategories[Math.floor(Math.random() * moodCategories.length)];
    }
  }

  if (w.includes("rain")) return "rainy-window";
  if (w.includes("night")) return "dreamy";
  if (w.includes("morning")) return "morning-momentum";
  if (w.includes("storm")) return "late-night-energy";
  if (w.includes("sunny") || w.includes("sun")) return "morning-momentum";

  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].key;
}

export function getCategoriesForMood(mood: string): CategoryProfile[] {
  const keys = MOOD_CATEGORY_AFFINITY[mood.toLowerCase()] ?? [];
  return keys
    .map((key) => CATEGORIES.find((c) => c.key === key))
    .filter((c): c is CategoryProfile => c !== undefined);
}

export default CATEGORIES;
