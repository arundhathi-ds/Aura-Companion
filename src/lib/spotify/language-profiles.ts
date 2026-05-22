/**
 * Language and Regional Profiles
 * Maps languages to cultural music characteristics, genres, artists, and visual identities.
 */

export type LanguageCode = "en" | "ta" | "ml" | "hi" | "te" | "ko" | "ja" | "ar" | "es" | "pt";

export interface LanguageProfile {
  code: LanguageCode;
  label: string;
  region: string;
  nativeLabel: string;
  primary_genres: string[];
  featured_artists: string[];
  visual: {
    gradient: string;
    tint: string;
    scanlines?: boolean;
    blur?: number;
  };
  companionTone: string;
  emotionalNotes: string;
  searchMarket: string; // Spotify market code
  audioModifiers: {
    energyOffset?: number;
    valenceOffset?: number;
    acousticnessOffset?: number;
    danceabilityOffset?: number;
  };
}

export const LANGUAGE_PROFILES: Record<LanguageCode, LanguageProfile> = {
  // SOUTH ASIAN
  ta: {
    code: "ta",
    label: "Tamil",
    region: "South Asia",
    nativeLabel: "தமிழ்",
    primary_genres: [
      "tamil-indie",
      "tamil-rap",
      "tamil-film",
      "desi-indie",
      "carnatic-fusion",
      "tamil-folk-electronic",
    ],
    featured_artists: [
      "Santhosh Narayanan",
      "Anirudh Ravichander",
      "GV Prakash Kumar",
      "Uyire",
      "Mirchi Music Award winners",
      "Kaaveri",
      "Thaikkudam Bridge",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)",
      tint: "#d4945c",
      blur: 2,
    },
    companionTone: "nostalgic, cinematic, emotionally resonant",
    emotionalNotes: "Tamil music carries old cinema magic and modern indie rebellion.",
    searchMarket: "IN",
    audioModifiers: {
      valenceOffset: 0.05,
      acousticnessOffset: 0.08,
    },
  },
  ml: {
    code: "ml",
    label: "Malayalam",
    region: "South Asia",
    nativeLabel: "മലയാളം",
    primary_genres: [
      "malayalam-indie",
      "kerala-folk",
      "malayalam-film",
      "ragga-muffin",
      "keralam-electronic",
      "jewish-malayalam-fusion",
    ],
    featured_artists: [
      "Shaan Rahman",
      "Sushin Shyam",
      "Govind Vasantha",
      "Prithviraj Sukumaran",
      "Travelogue",
      "Karthik",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #0a3a3a 0%, #051a1a 100%)",
      tint: "#6ee7b7",
      blur: 1,
    },
    companionTone: "soulful, reflective, deeply poetic",
    emotionalNotes: "Malayalam cinema breathes emotional depth and melodic grace.",
    searchMarket: "IN",
    audioModifiers: {
      valenceOffset: 0.02,
      acousticnessOffset: 0.1,
    },
  },
  hi: {
    code: "hi",
    label: "Hindi",
    region: "South Asia",
    nativeLabel: "हिन्दी",
    primary_genres: [
      "bollywood",
      "hindi-indie",
      "indie-pop-hindi",
      "hindi-folk",
      "neo-bollywood",
      "hindi-trap",
    ],
    featured_artists: [
      "A.R. Rahman",
      "Amit Trivedi",
      "Vishal Bhardwaj",
      "Nucleya",
      "Divine",
      "Seedhe Maut",
      "Ritviz",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #4c0519 0%, #2a0f1a 100%)",
      tint: "#f472b6",
      blur: 2,
    },
    companionTone: "grand, romantic, passionately cinematic",
    emotionalNotes: "Hindi music dances between Bollywood romance and urban rebellion.",
    searchMarket: "IN",
    audioModifiers: {
      valenceOffset: 0.1,
    },
  },
  te: {
    code: "te",
    label: "Telugu",
    region: "South Asia",
    nativeLabel: "తెలుగు",
    primary_genres: [
      "telugu-indie",
      "telugu-film",
      "telugu-folk",
      "hyderabad-electronic",
      "telugu-rap",
    ],
    featured_artists: ["Thaman S", "M. M. Keeravani", "Mani Osai", "Pritam", "Javed Ali"],
    visual: {
      gradient: "linear-gradient(180deg, #2d1b4e 0%, #1a0f2e 100%)",
      tint: "#c084fc",
      blur: 2,
    },
    companionTone: "vibrant, rhythmic, dynamically soulful",
    emotionalNotes: "Telugu music pulses with vibrant energy and classical undertones.",
    searchMarket: "IN",
    audioModifiers: {
      energyOffset: 0.08,
      valenceOffset: 0.08,
    },
  },

  // EAST ASIAN
  ko: {
    code: "ko",
    label: "Korean",
    region: "East Asia",
    nativeLabel: "한국어",
    primary_genres: [
      "k-pop",
      "k-indie",
      "k-rnb",
      "korean-ballad",
      "korean-indie-rock",
      "korean-electronic",
      "trot-modern",
    ],
    featured_artists: ["IU", "Taeyeon", "Epik High", "Zion.T", "AKMU", "Sunmi", "Taemin"],
    visual: {
      gradient: "linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)",
      tint: "#00ff88",
      scanlines: true,
      blur: 1,
    },
    companionTone: "polished, emotionally restrained yet deeply felt",
    emotionalNotes: "Korean music blends meticulous production with raw emotional truth.",
    searchMarket: "KR",
    audioModifiers: {
      valenceOffset: 0.05,
      acousticnessOffset: -0.1,
    },
  },
  ja: {
    code: "ja",
    label: "Japanese",
    region: "East Asia",
    nativeLabel: "日本語",
    primary_genres: [
      "city-pop",
      "japanese-indie",
      "anime-soundtrack",
      "vaporwave",
      "japanese-rnb",
      "shoegaze-jp",
      "enka-modern",
    ],
    featured_artists: [
      "Mariya Takeuchi",
      "Nujabes",
      "Eve",
      "Fujita Daisuke",
      "Chara",
      "Cornelius",
      "Sakamoto Ryuichi",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #0a0e27 0%, #1a0f3a 100%)",
      tint: "#a78bfa",
      scanlines: true,
      blur: 1,
    },
    companionTone: "introspective, aesthetically precise, subtly mystical",
    emotionalNotes: "Japanese music whispers elegance and melancholic beauty through silence.",
    searchMarket: "JP",
    audioModifiers: {
      energyOffset: -0.05,
      valenceOffset: 0.02,
      acousticnessOffset: 0.05,
    },
  },

  // MIDDLE EASTERN
  ar: {
    code: "ar",
    label: "Arabic",
    region: "Middle East",
    nativeLabel: "العربية",
    primary_genres: [
      "arabic-indie",
      "arabic-electronic",
      "neo-arabic",
      "mahraganat",
      "arabic-oud-fusion",
      "middle-eastern-rap",
    ],
    featured_artists: [
      "Cairokee",
      "Dina Hayek",
      "Amr Diab",
      "Mashrou Leila",
      "Abou Debeing",
      "Bassem Youssef",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #1a0d2e 0%, #0d0620 100%)",
      tint: "#f97316",
      blur: 3,
    },
    companionTone: "poetic, richly ornamental, mysteriously elegant",
    emotionalNotes: "Arabic music wraps emotions in lyrical poetry and ancient resonance.",
    searchMarket: "AE",
    audioModifiers: {
      acousticnessOffset: 0.12,
      valenceOffset: 0.08,
    },
  },

  // WESTERN
  es: {
    code: "es",
    label: "Spanish",
    region: "Latin America & Iberia",
    nativeLabel: "Español",
    primary_genres: [
      "latin-trap",
      "reggaeton",
      "spanish-indie",
      "flamenco-fusion",
      "latin-electronic",
      "spanish-folk",
    ],
    featured_artists: [
      "Bad Bunny",
      "Rosalía",
      "J Balvin",
      "Cultura Profética",
      "Silvio Rodríguez",
      "Santiago Cruz",
    ],
    visual: {
      gradient: "linear-gradient(180deg, #2e1810 0%, #1a0f08 100%)",
      tint: "#f59e0b",
      blur: 2,
    },
    companionTone: "passionate, rhythmically alive, warmly sensual",
    emotionalNotes: "Spanish music dances between fire and tenderness, always alive.",
    searchMarket: "MX",
    audioModifiers: {
      energyOffset: 0.12,
      danceabilityOffset: 0.15,
    },
  },
  pt: {
    code: "pt",
    label: "Portuguese",
    region: "Brazil",
    nativeLabel: "Português",
    primary_genres: [
      "bossa-nova",
      "samba-indie",
      "brazilian-funk",
      "tropicalia-modern",
      "brazilian-rock",
      "forró-electronic",
    ],
    featured_artists: ["Tom Jobim", "Gilberto Gil", "Anitta", "BaianaSystem", "Liniker", "Emicida"],
    visual: {
      gradient: "linear-gradient(180deg, #1a3a2e 0%, #0f2520 100%)",
      tint: "#10b981",
      blur: 2,
    },
    companionTone: "rhythmically flowing, warmly inviting, eternally musical",
    emotionalNotes: "Brazilian music breathes movement and soul into every moment.",
    searchMarket: "BR",
    audioModifiers: {
      danceabilityOffset: 0.1,
      valenceOffset: 0.08,
    },
  },
  en: {
    code: "en",
    label: "English",
    region: "Global",
    nativeLabel: "English",
    primary_genres: [
      "indie",
      "alternative",
      "electronic",
      "indie-rock",
      "rnb",
      "singer-songwriter",
    ],
    featured_artists: ["Bon Iver", "The National", "Frank Ocean", "Phoebe Bridgers", "James Blake"],
    visual: {
      gradient: "linear-gradient(180deg, #0f172a 0%, #021127 100%)",
      tint: "#7dd3fc",
      blur: 1,
    },
    companionTone: "introspective, linguistically precise, emotionally literate",
    emotionalNotes: "English music speaks the unspeakable with poetic clarity.",
    searchMarket: "US",
    audioModifiers: {},
  },
};

export function getLanguageProfile(code: LanguageCode): LanguageProfile {
  return LANGUAGE_PROFILES[code] || LANGUAGE_PROFILES.en;
}

export function getAllLanguageCodes(): LanguageCode[] {
  return Object.keys(LANGUAGE_PROFILES) as LanguageCode[];
}

export function getRegionalLanguages(region: string): LanguageProfile[] {
  return Object.values(LANGUAGE_PROFILES).filter((p) => p.region === region);
}

export default LANGUAGE_PROFILES;
