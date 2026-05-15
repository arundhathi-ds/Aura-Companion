export type SongIntent = "focus" | "workout" | "emotional" | "party" | "chill";
export type WeatherVibe = "sunny" | "rainy" | "stormy" | "night";
export type SongLanguage = "english" | "tamil" | "hindi" | "malayalam" | "spanish" | "korean";

export type Song = {
  title: string;
  artist: string;
  searchUrl: string;
  color: string;
  language: SongLanguage;
};

export const INTENT_OPTIONS: { key: SongIntent; emoji: string; label: string }[] = [
  { key: "focus",     emoji: "🎯", label: "Focusing" },
  { key: "workout",   emoji: "💪", label: "Workout" },
  { key: "emotional", emoji: "💭", label: "Emotional" },
  { key: "party",     emoji: "🎉", label: "Party" },
  { key: "chill",     emoji: "✨", label: "Chilling" },
];

export const WEATHER_OPTIONS: { key: WeatherVibe; emoji: string; label: string }[] = [
  { key: "sunny",  emoji: "☀️", label: "Sunny" },
  { key: "rainy",  emoji: "🌧️", label: "Rainy" },
  { key: "stormy", emoji: "⛈️", label: "Stormy" },
  { key: "night",  emoji: "🌙", label: "Night" },
];

export const LANGUAGE_OPTIONS: { key: SongLanguage; label: string }[] = [
  { key: "english",   label: "English" },
  { key: "tamil",     label: "Tamil" },
  { key: "hindi",     label: "Hindi" },
  { key: "malayalam", label: "Malayalam" },
  { key: "spanish",   label: "Spanish" },
  { key: "korean",    label: "Korean" },
];

function s(title: string, artist: string, lang: SongLanguage, color: string): Song {
  return {
    title, artist, language: lang, color,
    searchUrl: `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`,
  };
}

/**
 * A massive pool of hits categorized by Intent and Language.
 * Weather will act as a sub-filter (e.g. Rainy focus = Lo-fi/Classical, Sunny focus = Upbeat pop).
 */
const SONG_POOL: Record<SongIntent, Record<SongLanguage, Song[]>> = {
  focus: {
    english: [
      s("Golden Hour", "JVKE", "english", "oklch(0.8 0.1 60)"),
      s("Sunflower", "Post Malone", "english", "oklch(0.7 0.2 70)"),
      s("Circles", "Post Malone", "english", "oklch(0.6 0.1 50)"),
      s("Interstellar Theme", "Hans Zimmer", "english", "oklch(0.4 0.05 240)"),
      s("Experience", "Ludovico Einaudi", "english", "oklch(0.5 0.05 200)"),
      s("Lo-fi Hip Hop", "Lofi Girl", "english", "oklch(0.6 0.08 260)"),
    ],
    tamil: [
      s("Mental Manadhil", "A.R. Rahman", "tamil", "oklch(0.7 0.15 140)"),
      s("The Life of Ram", "Govind Vasantha", "tamil", "oklch(0.65 0.12 120)"),
      s("Naan Pizhai", "Anirudh Ravichander", "tamil", "oklch(0.6 0.1 300)"),
    ],
    hindi: [
      s("Kun Faya Kun", "A.R. Rahman", "hindi", "oklch(0.5 0.1 40)"),
      s("Kabira", "Pritam", "hindi", "oklch(0.65 0.12 50)"),
      s("Tum Se Hi", "Pritam", "hindi", "oklch(0.7 0.1 60)"),
    ],
    malayalam: [
      s("Malare", "Vijay Yesudas", "malayalam", "oklch(0.7 0.15 140)"),
      s("Darshana", "Hesham Abdul Wahab", "malayalam", "oklch(0.6 0.18 30)"),
    ],
    spanish: [
      s("Bailando", "Enrique Iglesias", "spanish", "oklch(0.7 0.2 20)"),
      s("La Bachata", "Manuel Turizo", "spanish", "oklch(0.6 0.15 340)"),
    ],
    korean: [
      s("Dynamite", "BTS", "korean", "oklch(0.8 0.18 300)"),
      s("Love Scenario", "iKON", "korean", "oklch(0.75 0.12 280)"),
    ],
  },
  workout: {
    english: [
      s("Lose Yourself", "Eminem", "english", "oklch(0.5 0.2 30)"),
      s("POWER", "Kanye West", "english", "oklch(0.4 0.2 20)"),
      s("Believer", "Imagine Dragons", "english", "oklch(0.6 0.15 280)"),
      s("Blinding Lights", "The Weeknd", "english", "oklch(0.55 0.2 320)"),
    ],
    tamil: [
      s("Vaathi Coming", "Anirudh Ravichander", "tamil", "oklch(0.6 0.25 40)"),
      s("Arabic Kuthu", "Anirudh Ravichander", "tamil", "oklch(0.7 0.2 350)"),
      s("Aaluma Doluma", "Anirudh Ravichander", "tamil", "oklch(0.55 0.2 20)"),
    ],
    hindi: [
      s("Zinda", "Shankar-Ehsaan-Loy", "hindi", "oklch(0.5 0.2 25)"),
      s("Kar Har Maidaan Fateh", "Sukhwinder Singh", "hindi", "oklch(0.6 0.18 40)"),
    ],
    malayalam: [
      s("Kalaavathi", "S. Thaman", "malayalam", "oklch(0.7 0.15 50)"),
    ],
    spanish: [
      s("Despacito", "Luis Fonsi", "spanish", "oklch(0.75 0.2 40)"),
      s("Gasolina", "Daddy Yankee", "spanish", "oklch(0.6 0.25 20)"),
    ],
    korean: [
      s("Mic Drop", "BTS", "korean", "oklch(0.4 0.15 280)"),
      s("How You Like That", "BLACKPINK", "korean", "oklch(0.5 0.2 320)"),
    ],
  },
  emotional: {
    english: [
      s("The Night We Met", "Lord Huron", "english", "oklch(0.4 0.1 260)"),
      s("Someone Like You", "Adele", "english", "oklch(0.5 0.05 280)"),
      s("Ghost", "Justin Bieber", "english", "oklch(0.7 0.1 240)"),
      s("Traitor", "Olivia Rodrigo", "english", "oklch(0.45 0.12 300)"),
    ],
    tamil: [
      s("Kanave Kanave", "Anirudh Ravichander", "tamil", "oklch(0.4 0.08 280)"),
      s("Po Nee Po", "Anirudh Ravichander", "tamil", "oklch(0.45 0.1 260)"),
      s("Munbe Vaa", "A.R. Rahman", "tamil", "oklch(0.7 0.1 140)"),
    ],
    hindi: [
      s("Channa Mereya", "Arijit Singh", "hindi", "oklch(0.5 0.15 40)"),
      s("Tum Hi Ho", "Arijit Singh", "hindi", "oklch(0.45 0.12 340)"),
      s("Agar Tum Saath Ho", "Alka Yagnik, Arijit Singh", "hindi", "oklch(0.6 0.1 180)"),
    ],
    malayalam: [
      s("Aaradhike", "Sooraj Santhosh", "malayalam", "oklch(0.7 0.1 140)"),
    ],
    spanish: [
      s("Amor Eterno", "Juan Gabriel", "spanish", "oklch(0.5 0.05 20)"),
    ],
    korean: [
      s("Spring Day", "BTS", "korean", "oklch(0.65 0.1 240)"),
      s("Stay With Me", "Chanyeol, Punch", "korean", "oklch(0.55 0.12 260)"),
    ],
  },
  party: {
    english: [
      s("Uptown Funk", "Bruno Mars", "english", "oklch(0.75 0.2 30)"),
      s("Party In The U.S.A.", "Miley Cyrus", "english", "oklch(0.7 0.18 350)"),
      s("Levitating", "Dua Lipa", "english", "oklch(0.65 0.22 300)"),
    ],
    tamil: [
      s("Enjoy Enjaami", "Dhee, Arivu", "tamil", "oklch(0.65 0.2 120)"),
      s("Petta Paraak", "Anirudh Ravichander", "tamil", "oklch(0.55 0.2 30)"),
    ],
    hindi: [
      s("Ghungroo", "Arijit Singh", "hindi", "oklch(0.7 0.18 340)"),
      s("Abhi Toh Party Shuru Hui Hai", "Badshah", "hindi", "oklch(0.75 0.2 40)"),
    ],
    malayalam: [
      s("Jimikki Kammal", "Vineeth Sreenivasan", "malayalam", "oklch(0.75 0.18 140)"),
    ],
    spanish: [
      s("Titi Me Pregunto", "Bad Bunny", "spanish", "oklch(0.6 0.2 320)"),
      s("Hips Don't Lie", "Shakira", "spanish", "oklch(0.7 0.25 40)"),
    ],
    korean: [
      s("Gangnam Style", "PSY", "korean", "oklch(0.65 0.25 180)"),
      s("Kill This Love", "BLACKPINK", "korean", "oklch(0.55 0.2 320)"),
    ],
  },
  chill: {
    english: [
      s("Watermelon Sugar", "Harry Styles", "english", "oklch(0.7 0.2 20)"),
      s("Dreams", "Fleetwood Mac", "english", "oklch(0.6 0.1 200)"),
      s("Peaches", "Justin Bieber", "english", "oklch(0.75 0.15 30)"),
    ],
    tamil: [
      s("Kadhaippoma", "Sid Sriram", "tamil", "oklch(0.65 0.1 240)"),
      s("Vaseegara", "Harris Jayaraj", "tamil", "oklch(0.7 0.1 140)"),
    ],
    hindi: [
      s("Iktara", "Amit Trivedi", "hindi", "oklch(0.65 0.12 50)"),
      s("Khaabon Ke Parinday", "Alyssa Mendonsa", "hindi", "oklch(0.7 0.1 180)"),
    ],
    malayalam: [
      s("Neela Akasham", "Rex Vijayan", "malayalam", "oklch(0.6 0.15 200)"),
    ],
    spanish: [
      s("La Flaca", "Jarabe de Palo", "spanish", "oklch(0.6 0.1 20)"),
    ],
    korean: [
      s("Eight", "IU, SUGA", "korean", "oklch(0.7 0.12 240)"),
      s("Some", "Bol4", "korean", "oklch(0.75 0.1 300)"),
    ],
  },
};

export function getDynamicSongs(intent: SongIntent, language: SongLanguage, weather: WeatherVibe): Song[] {
  const pool = SONG_POOL[intent]?.[language] ?? [];
  
  // Shuffle the pool to ensure different results every time
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  
  // Weather-based slight filter (e.g. if rainy, prioritize slightly calmer songs if available)
  // For now, return up to 10 shuffled songs to ensure high variety
  return shuffled.slice(0, 8);
}

export function getVibeHeadline(intent: SongIntent, weather: WeatherVibe, language: SongLanguage): string {
  const langLabel = LANGUAGE_OPTIONS.find(l => l.key === language)?.label || "Global";
  return `${langLabel} hits to match your ${intent} vibe.`;
}
