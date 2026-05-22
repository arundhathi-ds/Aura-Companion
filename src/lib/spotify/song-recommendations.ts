export type SongIntent = "focus" | "workout" | "emotional" | "party" | "chill";
export type WeatherVibe = "sunny" | "rainy" | "stormy" | "night";
export type SongLanguage =
  | "english"
  | "tamil"
  | "hindi"
  | "malayalam"
  | "spanish"
  | "korean"
  | "japanese"
  | "arabic"
  | "portuguese"
  | "telugu";

export type Song = {
  title: string;
  artist: string;
  searchUrl: string;
  color: string;
  language: SongLanguage;
};

export const INTENT_OPTIONS: { key: SongIntent; emoji: string; label: string }[] = [
  { key: "focus", emoji: "🎯", label: "Focusing" },
  { key: "workout", emoji: "💪", label: "Workout" },
  { key: "emotional", emoji: "💭", label: "Emotional" },
  { key: "party", emoji: "🎉", label: "Party" },
  { key: "chill", emoji: "✨", label: "Chilling" },
];

export const WEATHER_OPTIONS: { key: WeatherVibe; emoji: string; label: string }[] = [
  { key: "sunny", emoji: "☀️", label: "Sunny" },
  { key: "rainy", emoji: "🌧️", label: "Rainy" },
  { key: "stormy", emoji: "⛈️", label: "Stormy" },
  { key: "night", emoji: "🌙", label: "Night" },
];

export const LANGUAGE_OPTIONS: { key: SongLanguage; label: string }[] = [
  { key: "english", label: "English" },
  { key: "tamil", label: "Tamil" },
  { key: "hindi", label: "Hindi" },
  { key: "malayalam", label: "Malayalam" },
  { key: "telugu", label: "Telugu" },
  { key: "spanish", label: "Spanish" },
  { key: "korean", label: "Korean" },
  { key: "japanese", label: "Japanese" },
  { key: "arabic", label: "Arabic" },
  { key: "portuguese", label: "Portuguese" },
];

function s(title: string, artist: string, lang: SongLanguage, color: string): Song {
  return {
    title,
    artist,
    language: lang,
    color,
    searchUrl: `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`,
  };
}

const SONG_POOL: Record<SongIntent, Record<SongLanguage, Song[]>> = {
  focus: {
    english: [
      s("Golden Hour", "JVKE", "english", "oklch(0.8 0.1 60)"),
      s("Sunflower", "Post Malone", "english", "oklch(0.7 0.2 70)"),
      s("Circles", "Post Malone", "english", "oklch(0.6 0.1 50)"),
      s("Interstellar Theme", "Hans Zimmer", "english", "oklch(0.4 0.05 240)"),
      s("Experience", "Ludovico Einaudi", "english", "oklch(0.5 0.05 200)"),
      s("Lo-fi Hip Hop", "Lofi Girl", "english", "oklch(0.6 0.08 260)"),
      s("Intro", "The xx", "english", "oklch(0.45 0.08 240)"),
      s("Nocturne", "Secret Garden", "english", "oklch(0.5 0.12 200)"),
      s("Weightless", "Marconi Union", "english", "oklch(0.55 0.06 220)"),
      s("Nuvole Bianche", "Ludovico Einaudi", "english", "oklch(0.6 0.04 200)"),
      s("River Flows In You", "Yiruma", "english", "oklch(0.65 0.08 210)"),
      s("Time", "Hans Zimmer", "english", "oklch(0.42 0.06 250)"),
      s("Clair de Lune", "Debussy", "english", "oklch(0.58 0.05 230)"),
      s("An Ending (Ascent)", "Brian Eno", "english", "oklch(0.5 0.04 200)"),
      s("On the Nature of Daylight", "Max Richter", "english", "oklch(0.45 0.06 260)"),
    ],
    tamil: [
      s("Mental Manadhil", "A.R. Rahman", "tamil", "oklch(0.7 0.15 140)"),
      s("The Life of Ram", "Govind Vasantha", "tamil", "oklch(0.65 0.12 120)"),
      s("Naan Pizhai", "Anirudh Ravichander", "tamil", "oklch(0.6 0.1 300)"),
      s("Ennai Vittu Sellathey", "Haricharan", "tamil", "oklch(0.55 0.14 130)"),
      s("Kadal Raasa", "Yuvan Shankar Raja", "tamil", "oklch(0.6 0.1 200)"),
      s("Nenjukulle", "A.R. Rahman", "tamil", "oklch(0.65 0.12 140)"),
      s("Uyire", "A.R. Rahman", "tamil", "oklch(0.7 0.1 120)"),
      s("Thalli Pogathey", "A.R. Rahman", "tamil", "oklch(0.6 0.14 150)"),
    ],
    hindi: [
      s("Kun Faya Kun", "A.R. Rahman", "hindi", "oklch(0.5 0.1 40)"),
      s("Kabira", "Pritam", "hindi", "oklch(0.65 0.12 50)"),
      s("Tum Se Hi", "Pritam", "hindi", "oklch(0.7 0.1 60)"),
      s("Ae Dil Hai Mushkil", "Pritam", "hindi", "oklch(0.55 0.14 340)"),
      s("Phir Se Ud Chala", "Mohit Chauhan", "hindi", "oklch(0.6 0.12 40)"),
      s("Ilahi", "Arijit Singh", "hindi", "oklch(0.65 0.1 50)"),
      s("Kahaan Hoon Main", "A.R. Rahman", "hindi", "oklch(0.5 0.08 60)"),
    ],
    malayalam: [
      s("Malare", "Vijay Yesudas", "malayalam", "oklch(0.7 0.15 140)"),
      s("Darshana", "Hesham Abdul Wahab", "malayalam", "oklch(0.6 0.18 30)"),
      s("Minungum Minnaminuge", "M. Jayachandran", "malayalam", "oklch(0.65 0.12 120)"),
      s("Theevandi Theme", "Kailas Menon", "malayalam", "oklch(0.55 0.1 180)"),
      s("Vaanam Thilathilakkanu", "Sushin Shyam", "malayalam", "oklch(0.6 0.14 140)"),
    ],
    spanish: [
      s("Bailando", "Enrique Iglesias", "spanish", "oklch(0.7 0.2 20)"),
      s("La Bachata", "Manuel Turizo", "spanish", "oklch(0.6 0.15 340)"),
      s("Clandestino", "Manu Chao", "spanish", "oklch(0.65 0.12 40)"),
      s("Entre Dos Aguas", "Paco de Lucía", "spanish", "oklch(0.55 0.1 30)"),
      s("Mediterráneo", "Joan Manuel Serrat", "spanish", "oklch(0.6 0.1 50)"),
    ],
    korean: [
      s("Dynamite", "BTS", "korean", "oklch(0.8 0.18 300)"),
      s("Love Scenario", "iKON", "korean", "oklch(0.75 0.12 280)"),
      s("Through the Night", "IU", "korean", "oklch(0.6 0.1 240)"),
      s("Star", "Mino", "korean", "oklch(0.7 0.14 260)"),
      s("Rain", "Taeyeon", "korean", "oklch(0.55 0.12 220)"),
    ],
    japanese: [
      s("Plastic Love", "Mariya Takeuchi", "japanese", "oklch(0.7 0.18 300)"),
      s("Feather", "Nujabes", "japanese", "oklch(0.55 0.1 200)"),
      s("Merry Christmas Mr. Lawrence", "Ryuichi Sakamoto", "japanese", "oklch(0.5 0.06 220)"),
      s("Lemon", "Kenshi Yonezu", "japanese", "oklch(0.65 0.14 60)"),
      s("Shinunoga E-Wa", "Fujii Kaze", "japanese", "oklch(0.6 0.12 240)"),
    ],
    arabic: [
      s("Tamally Maak", "Amr Diab", "arabic", "oklch(0.65 0.15 30)"),
      s("Habibi Ya Nour El Ain", "Amr Diab", "arabic", "oklch(0.7 0.12 40)"),
      s("Ahwak", "Abdel Halim Hafez", "arabic", "oklch(0.55 0.1 20)"),
      s("Enta Omri", "Umm Kulthum", "arabic", "oklch(0.5 0.08 30)"),
    ],
    portuguese: [
      s("Garota de Ipanema", "Tom Jobim", "portuguese", "oklch(0.7 0.14 120)"),
      s("Águas de Março", "Elis Regina", "portuguese", "oklch(0.65 0.1 140)"),
      s("Eu Sei Que Vou Te Amar", "Tom Jobim", "portuguese", "oklch(0.6 0.12 180)"),
      s("Corcovado", "Tom Jobim", "portuguese", "oklch(0.55 0.08 200)"),
    ],
    telugu: [
      s("Buttabomma", "Armaan Malik", "telugu", "oklch(0.7 0.18 40)"),
      s("Inkem Inkem", "Sid Sriram", "telugu", "oklch(0.65 0.14 120)"),
      s("Samajavaragamana", "Sid Sriram", "telugu", "oklch(0.6 0.12 140)"),
      s("Srivalli", "Sid Sriram", "telugu", "oklch(0.55 0.16 280)"),
    ],
  },
  workout: {
    english: [
      s("Lose Yourself", "Eminem", "english", "oklch(0.5 0.2 30)"),
      s("POWER", "Kanye West", "english", "oklch(0.4 0.2 20)"),
      s("Believer", "Imagine Dragons", "english", "oklch(0.6 0.15 280)"),
      s("Blinding Lights", "The Weeknd", "english", "oklch(0.55 0.2 320)"),
      s("Stronger", "Kanye West", "english", "oklch(0.5 0.18 30)"),
      s("Eye of the Tiger", "Survivor", "english", "oklch(0.6 0.2 40)"),
      s("Till I Collapse", "Eminem", "english", "oklch(0.45 0.22 20)"),
      s("Can't Hold Us", "Macklemore", "english", "oklch(0.65 0.18 60)"),
      s("Run This Town", "JAY-Z", "english", "oklch(0.5 0.2 280)"),
      s("Sicko Mode", "Travis Scott", "english", "oklch(0.4 0.22 320)"),
      s("Jumpman", "Drake", "english", "oklch(0.55 0.2 300)"),
      s("DNA.", "Kendrick Lamar", "english", "oklch(0.45 0.22 280)"),
    ],
    tamil: [
      s("Vaathi Coming", "Anirudh Ravichander", "tamil", "oklch(0.6 0.25 40)"),
      s("Arabic Kuthu", "Anirudh Ravichander", "tamil", "oklch(0.7 0.2 350)"),
      s("Aaluma Doluma", "Anirudh Ravichander", "tamil", "oklch(0.55 0.2 20)"),
      s("Rowdy Baby", "Dhanush", "tamil", "oklch(0.65 0.22 30)"),
      s("Kutti Story", "Anirudh Ravichander", "tamil", "oklch(0.6 0.2 340)"),
      s("Singappenney", "A.R. Rahman", "tamil", "oklch(0.55 0.18 40)"),
    ],
    hindi: [
      s("Zinda", "Shankar-Ehsaan-Loy", "hindi", "oklch(0.5 0.2 25)"),
      s("Kar Har Maidaan Fateh", "Sukhwinder Singh", "hindi", "oklch(0.6 0.18 40)"),
      s("Sultan", "Salman Khan", "hindi", "oklch(0.55 0.2 30)"),
      s("Malhari", "Vishal Dadlani", "hindi", "oklch(0.65 0.22 350)"),
      s("Apna Time Aayega", "Divine", "hindi", "oklch(0.6 0.2 40)"),
    ],
    malayalam: [
      s("Kalaavathi", "S. Thaman", "malayalam", "oklch(0.7 0.15 50)"),
      s("Romancham Theme", "Sushin Shyam", "malayalam", "oklch(0.6 0.18 30)"),
      s("Pachakuthira", "M. Jayachandran", "malayalam", "oklch(0.65 0.2 40)"),
    ],
    spanish: [
      s("Despacito", "Luis Fonsi", "spanish", "oklch(0.75 0.2 40)"),
      s("Gasolina", "Daddy Yankee", "spanish", "oklch(0.6 0.25 20)"),
      s("Vivir Mi Vida", "Marc Anthony", "spanish", "oklch(0.7 0.22 30)"),
      s("Danza Kuduro", "Don Omar", "spanish", "oklch(0.65 0.2 350)"),
      s("Ella Baila Sola", "Eslabon Armado", "spanish", "oklch(0.6 0.18 40)"),
    ],
    korean: [
      s("Mic Drop", "BTS", "korean", "oklch(0.4 0.15 280)"),
      s("How You Like That", "BLACKPINK", "korean", "oklch(0.5 0.2 320)"),
      s("God's Menu", "Stray Kids", "korean", "oklch(0.45 0.22 300)"),
      s("Ddu-Du Ddu-Du", "BLACKPINK", "korean", "oklch(0.5 0.2 310)"),
      s("Jopping", "SuperM", "korean", "oklch(0.55 0.18 290)"),
    ],
    japanese: [
      s("Gurenge", "LiSA", "japanese", "oklch(0.6 0.22 350)"),
      s("Kaikai Kitan", "Eve", "japanese", "oklch(0.55 0.2 300)"),
      s("Unravel", "TK from Ling Tosite Sigure", "japanese", "oklch(0.45 0.18 280)"),
      s("Inferno", "Mrs. GREEN APPLE", "japanese", "oklch(0.6 0.2 40)"),
    ],
    arabic: [
      s("Ya Lili", "Balti", "arabic", "oklch(0.6 0.22 30)"),
      s("Leila", "Cairokee", "arabic", "oklch(0.55 0.2 40)"),
      s("3 Daqat", "Abu", "arabic", "oklch(0.65 0.18 20)"),
    ],
    portuguese: [
      s("Vai Malandra", "Anitta", "portuguese", "oklch(0.65 0.22 340)"),
      s("Que Tiro Foi Esse", "Jojo Maronttinni", "portuguese", "oklch(0.6 0.2 20)"),
      s("Baile de Favela", "MC João", "portuguese", "oklch(0.55 0.22 30)"),
    ],
    telugu: [
      s("Oo Antava", "Indravathi Chauhan", "telugu", "oklch(0.6 0.22 340)"),
      s("Naatu Naatu", "Rahul Sipligunj", "telugu", "oklch(0.7 0.25 30)"),
      s("Butta Bomma", "Armaan Malik", "telugu", "oklch(0.65 0.2 40)"),
    ],
  },
  emotional: {
    english: [
      s("The Night We Met", "Lord Huron", "english", "oklch(0.4 0.1 260)"),
      s("Someone Like You", "Adele", "english", "oklch(0.5 0.05 280)"),
      s("Ghost", "Justin Bieber", "english", "oklch(0.7 0.1 240)"),
      s("Traitor", "Olivia Rodrigo", "english", "oklch(0.45 0.12 300)"),
      s("All Too Well", "Taylor Swift", "english", "oklch(0.5 0.1 340)"),
      s("When the Party's Over", "Billie Eilish", "english", "oklch(0.4 0.08 260)"),
      s("Skinny Love", "Bon Iver", "english", "oklch(0.45 0.06 220)"),
      s("Liability", "Lorde", "english", "oklch(0.5 0.08 280)"),
      s("Hurt", "Johnny Cash", "english", "oklch(0.4 0.06 30)"),
      s("Holocene", "Bon Iver", "english", "oklch(0.5 0.08 200)"),
      s("Motion Sickness", "Phoebe Bridgers", "english", "oklch(0.45 0.1 240)"),
      s("White Ferrari", "Frank Ocean", "english", "oklch(0.55 0.08 210)"),
    ],
    tamil: [
      s("Kanave Kanave", "Anirudh Ravichander", "tamil", "oklch(0.4 0.08 280)"),
      s("Po Nee Po", "Anirudh Ravichander", "tamil", "oklch(0.45 0.1 260)"),
      s("Munbe Vaa", "A.R. Rahman", "tamil", "oklch(0.7 0.1 140)"),
      s("Ennodu Nee Irundhaal", "A.R. Rahman", "tamil", "oklch(0.5 0.12 300)"),
      s("Venmathi Venmathiye", "Yuvan Shankar Raja", "tamil", "oklch(0.55 0.1 260)"),
      s("Yennai Arindhaal Theme", "Harris Jayaraj", "tamil", "oklch(0.45 0.08 240)"),
    ],
    hindi: [
      s("Channa Mereya", "Arijit Singh", "hindi", "oklch(0.5 0.15 40)"),
      s("Tum Hi Ho", "Arijit Singh", "hindi", "oklch(0.45 0.12 340)"),
      s("Agar Tum Saath Ho", "Alka Yagnik, Arijit Singh", "hindi", "oklch(0.6 0.1 180)"),
      s("Phir Le Aaya Dil", "Arijit Singh", "hindi", "oklch(0.5 0.12 280)"),
      s("Kabhi Alvida Naa Kehna", "Sonu Nigam", "hindi", "oklch(0.55 0.1 300)"),
      s("Tujhe Kitna Chahne Lage", "Arijit Singh", "hindi", "oklch(0.45 0.14 340)"),
    ],
    malayalam: [
      s("Aaradhike", "Sooraj Santhosh", "malayalam", "oklch(0.7 0.1 140)"),
      s("Kaathirunnu Kaathirunnu", "Vineeth Sreenivasan", "malayalam", "oklch(0.6 0.12 120)"),
      s("Pavizha Mazha", "Vineeth Sreenivasan", "malayalam", "oklch(0.55 0.14 180)"),
      s("Jeevamshamayi", "KS Harisankar", "malayalam", "oklch(0.65 0.1 140)"),
    ],
    spanish: [
      s("Amor Eterno", "Juan Gabriel", "spanish", "oklch(0.5 0.05 20)"),
      s("Te Robaré", "Nicky Jam", "spanish", "oklch(0.55 0.12 340)"),
      s("Recuérdame", "La Oreja de Van Gogh", "spanish", "oklch(0.6 0.1 280)"),
      s("Cómo Mirarte", "Sebastián Yatra", "spanish", "oklch(0.55 0.14 300)"),
    ],
    korean: [
      s("Spring Day", "BTS", "korean", "oklch(0.65 0.1 240)"),
      s("Stay With Me", "Chanyeol, Punch", "korean", "oklch(0.55 0.12 260)"),
      s("Love Poem", "IU", "korean", "oklch(0.6 0.1 280)"),
      s("Palette", "IU feat. G-Dragon", "korean", "oklch(0.65 0.14 240)"),
      s("Breathe", "Lee Hi", "korean", "oklch(0.5 0.1 260)"),
    ],
    japanese: [
      s("Lemon", "Kenshi Yonezu", "japanese", "oklch(0.6 0.12 60)"),
      s("Sparkle", "RADWIMPS", "japanese", "oklch(0.55 0.14 240)"),
      s("Nandemonaiya", "RADWIMPS", "japanese", "oklch(0.5 0.1 260)"),
      s("First Love", "Utada Hikaru", "japanese", "oklch(0.55 0.08 280)"),
    ],
    arabic: [
      s("Enta Omri", "Umm Kulthum", "arabic", "oklch(0.5 0.08 30)"),
      s("Ana Bastanak", "Amr Diab", "arabic", "oklch(0.55 0.12 40)"),
      s("Ehna Msh Bto3 Haga", "Cairokee", "arabic", "oklch(0.6 0.1 20)"),
    ],
    portuguese: [
      s("Construção", "Chico Buarque", "portuguese", "oklch(0.5 0.08 140)"),
      s("Drão", "Gilberto Gil", "portuguese", "oklch(0.55 0.1 120)"),
      s("Epitáfio", "Titãs", "portuguese", "oklch(0.6 0.12 180)"),
    ],
    telugu: [
      s("Kanunna Kalyanam", "Sid Sriram", "telugu", "oklch(0.55 0.12 280)"),
      s("Nee Kannu Neeli Samudram", "Anand Aravindakshan", "telugu", "oklch(0.6 0.1 240)"),
      s("Saranga Dariya", "Mangli", "telugu", "oklch(0.65 0.14 120)"),
    ],
  },
  party: {
    english: [
      s("Uptown Funk", "Bruno Mars", "english", "oklch(0.75 0.2 30)"),
      s("Party In The U.S.A.", "Miley Cyrus", "english", "oklch(0.7 0.18 350)"),
      s("Levitating", "Dua Lipa", "english", "oklch(0.65 0.22 300)"),
      s("Don't Start Now", "Dua Lipa", "english", "oklch(0.7 0.2 310)"),
      s("Savage Love", "Jason Derulo", "english", "oklch(0.65 0.22 340)"),
      s("Shut Up and Dance", "WALK THE MOON", "english", "oklch(0.75 0.18 30)"),
      s("Shake It Off", "Taylor Swift", "english", "oklch(0.8 0.2 60)"),
      s("One Dance", "Drake", "english", "oklch(0.6 0.2 280)"),
      s("Get Lucky", "Daft Punk", "english", "oklch(0.7 0.22 300)"),
      s("Moves Like Jagger", "Maroon 5", "english", "oklch(0.65 0.2 340)"),
    ],
    tamil: [
      s("Enjoy Enjaami", "Dhee, Arivu", "tamil", "oklch(0.65 0.2 120)"),
      s("Petta Paraak", "Anirudh Ravichander", "tamil", "oklch(0.55 0.2 30)"),
      s("Jolly O Gymkhana", "Anirudh Ravichander", "tamil", "oklch(0.6 0.22 40)"),
      s("Rakita Rakita", "Dhanush", "tamil", "oklch(0.55 0.2 20)"),
      s("Vaadi Pulla Vaadi", "Hiphop Tamizha", "tamil", "oklch(0.65 0.18 30)"),
    ],
    hindi: [
      s("Ghungroo", "Arijit Singh", "hindi", "oklch(0.7 0.18 340)"),
      s("Abhi Toh Party Shuru Hui Hai", "Badshah", "hindi", "oklch(0.75 0.2 40)"),
      s("Badtameez Dil", "Benny Dayal", "hindi", "oklch(0.65 0.22 30)"),
      s("London Thumakda", "Labh Janjua", "hindi", "oklch(0.7 0.2 350)"),
      s("Kala Chashma", "Badshah", "hindi", "oklch(0.65 0.22 40)"),
    ],
    malayalam: [
      s("Jimikki Kammal", "Vineeth Sreenivasan", "malayalam", "oklch(0.75 0.18 140)"),
      s("Entammede Jimikki Kammal", "Vineeth Sreenivasan", "malayalam", "oklch(0.7 0.2 120)"),
      s("Pathukkulam", "Vineeth Sreenivasan", "malayalam", "oklch(0.65 0.18 140)"),
    ],
    spanish: [
      s("Titi Me Pregunto", "Bad Bunny", "spanish", "oklch(0.6 0.2 320)"),
      s("Hips Don't Lie", "Shakira", "spanish", "oklch(0.7 0.25 40)"),
      s("Waka Waka", "Shakira", "spanish", "oklch(0.75 0.22 30)"),
      s("Mi Gente", "J Balvin", "spanish", "oklch(0.65 0.2 340)"),
      s("Safaera", "Bad Bunny", "spanish", "oklch(0.6 0.22 320)"),
    ],
    korean: [
      s("Gangnam Style", "PSY", "korean", "oklch(0.65 0.25 180)"),
      s("Kill This Love", "BLACKPINK", "korean", "oklch(0.55 0.2 320)"),
      s("Butter", "BTS", "korean", "oklch(0.7 0.22 60)"),
      s("Next Level", "aespa", "korean", "oklch(0.6 0.2 280)"),
      s("Hype Boy", "NewJeans", "korean", "oklch(0.65 0.18 300)"),
    ],
    japanese: [
      s("Loveシック", "Ado", "japanese", "oklch(0.6 0.22 300)"),
      s("New Rules", "YOASOBI", "japanese", "oklch(0.65 0.2 280)"),
      s("Idol", "YOASOBI", "japanese", "oklch(0.7 0.22 300)"),
      s("Pretender", "Official HIGE DANdism", "japanese", "oklch(0.6 0.18 260)"),
    ],
    arabic: [
      s("Bint El Shalabiya", "Amr Diab", "arabic", "oklch(0.65 0.2 30)"),
      s("Tamally Maak", "Amr Diab", "arabic", "oklch(0.7 0.18 40)"),
      s("Ya Lili", "Balti", "arabic", "oklch(0.6 0.22 20)"),
    ],
    portuguese: [
      s("Ai Se Eu Te Pego", "Michel Teló", "portuguese", "oklch(0.75 0.2 40)"),
      s("Tá Tranquilo Tá Favorável", "MC Bin Laden", "portuguese", "oklch(0.65 0.22 30)"),
      s("Envolver", "Anitta", "portuguese", "oklch(0.7 0.2 340)"),
    ],
    telugu: [
      s("Buttabomma", "Armaan Malik", "telugu", "oklch(0.7 0.2 40)"),
      s("Ranga Ranga Rangasthalaana", "Ram Miriyala", "telugu", "oklch(0.65 0.22 30)"),
      s("Naatu Naatu", "Rahul Sipligunj", "telugu", "oklch(0.75 0.25 40)"),
    ],
  },
  chill: {
    english: [
      s("Watermelon Sugar", "Harry Styles", "english", "oklch(0.7 0.2 20)"),
      s("Dreams", "Fleetwood Mac", "english", "oklch(0.6 0.1 200)"),
      s("Peaches", "Justin Bieber", "english", "oklch(0.75 0.15 30)"),
      s("Heat Waves", "Glass Animals", "english", "oklch(0.65 0.18 40)"),
      s("Here Comes the Sun", "The Beatles", "english", "oklch(0.7 0.16 60)"),
      s("Banana Pancakes", "Jack Johnson", "english", "oklch(0.6 0.12 40)"),
      s("Riptide", "Vance Joy", "english", "oklch(0.65 0.14 120)"),
      s("Electric Feel", "MGMT", "english", "oklch(0.6 0.18 280)"),
      s("Float On", "Modest Mouse", "english", "oklch(0.55 0.12 200)"),
      s("Hey Ya!", "OutKast", "english", "oklch(0.7 0.2 120)"),
    ],
    tamil: [
      s("Kadhaippoma", "Sid Sriram", "tamil", "oklch(0.65 0.1 240)"),
      s("Vaseegara", "Harris Jayaraj", "tamil", "oklch(0.7 0.1 140)"),
      s("Oh Penne", "Yuvan Shankar Raja", "tamil", "oklch(0.6 0.12 120)"),
      s("Idhazhin Oram", "Yuvan Shankar Raja", "tamil", "oklch(0.55 0.1 200)"),
      s("Kannazhaga", "Anirudh Ravichander", "tamil", "oklch(0.65 0.14 140)"),
    ],
    hindi: [
      s("Iktara", "Amit Trivedi", "hindi", "oklch(0.65 0.12 50)"),
      s("Khaabon Ke Parinday", "Alyssa Mendonsa", "hindi", "oklch(0.7 0.1 180)"),
      s("Chaiiyya Chaiyya", "A.R. Rahman", "hindi", "oklch(0.6 0.14 40)"),
      s("Tere Bina", "A.R. Rahman", "hindi", "oklch(0.55 0.12 60)"),
      s("Safarnama", "Pritam", "hindi", "oklch(0.6 0.1 50)"),
    ],
    malayalam: [
      s("Neela Akasham", "Rex Vijayan", "malayalam", "oklch(0.6 0.15 200)"),
      s("Poomaram", "K. S. Harisankar", "malayalam", "oklch(0.65 0.12 120)"),
      s("Pon Thaarangal", "K J Yesudas", "malayalam", "oklch(0.7 0.1 140)"),
    ],
    spanish: [
      s("La Flaca", "Jarabe de Palo", "spanish", "oklch(0.6 0.1 20)"),
      s("Bonito", "Jarabe de Palo", "spanish", "oklch(0.65 0.12 40)"),
      s("Ojalá", "Silvio Rodríguez", "spanish", "oklch(0.55 0.08 30)"),
      s("11 PM", "Maluma", "spanish", "oklch(0.6 0.14 340)"),
    ],
    korean: [
      s("Eight", "IU, SUGA", "korean", "oklch(0.7 0.12 240)"),
      s("Some", "Bol4", "korean", "oklch(0.75 0.1 300)"),
      s("Way Back Home", "SHAUN", "korean", "oklch(0.65 0.14 200)"),
      s("Celebrity", "IU", "korean", "oklch(0.7 0.16 280)"),
      s("Blue Lemonade", "Red Velvet", "korean", "oklch(0.6 0.12 220)"),
    ],
    japanese: [
      s("Stay With Me", "Miki Matsubara", "japanese", "oklch(0.65 0.16 280)"),
      s("Mayonaka no Door", "Miki Matsubara", "japanese", "oklch(0.6 0.14 300)"),
      s("Koi", "Gen Hoshino", "japanese", "oklch(0.7 0.12 60)"),
      s("Que Sera Sera", "Reiko Ike", "japanese", "oklch(0.6 0.1 40)"),
    ],
    arabic: [
      s("Beirut", "Cairokee", "arabic", "oklch(0.6 0.1 30)"),
      s("Nour El Ain", "Amr Diab", "arabic", "oklch(0.65 0.14 40)"),
      s("Sidi Mansour", "Saber Rebai", "arabic", "oklch(0.7 0.12 20)"),
    ],
    portuguese: [
      s("Chega de Saudade", "Tom Jobim", "portuguese", "oklch(0.6 0.1 120)"),
      s("Wave", "Tom Jobim", "portuguese", "oklch(0.65 0.12 140)"),
      s("Gostava Tanto de Você", "Tim Maia", "portuguese", "oklch(0.55 0.14 180)"),
    ],
    telugu: [
      s("Inkem Inkem", "Sid Sriram", "telugu", "oklch(0.65 0.12 120)"),
      s("Choosi Chudangane", "Sid Sriram", "telugu", "oklch(0.7 0.14 140)"),
      s("Samajavaragamana", "Sid Sriram", "telugu", "oklch(0.6 0.1 180)"),
    ],
  },
};

const WEATHER_ENERGY_MAP: Record<WeatherVibe, { sortKey: "calm" | "energetic"; filter: number }> = {
  sunny: { sortKey: "energetic", filter: 0.6 },
  rainy: { sortKey: "calm", filter: 0.4 },
  stormy: { sortKey: "energetic", filter: 0.7 },
  night: { sortKey: "calm", filter: 0.3 },
};

const ROTATION_KEY = "aura_song_pool_rotation";
const ROTATION_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours

function getRotationSeed(): number {
  try {
    if (typeof window === "undefined") return Date.now();
    const raw = localStorage.getItem(ROTATION_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp < ROTATION_WINDOW_MS) return data.seed;
    }
    const seed = Math.floor(Math.random() * 100000);
    localStorage.setItem(ROTATION_KEY, JSON.stringify({ seed, timestamp: Date.now() }));
    return seed;
  } catch {
    return Date.now();
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRecentlyPlayedSongKeys(): Set<string> {
  try {
    if (typeof window === "undefined") return new Set();
    const raw = localStorage.getItem("aura_music_memory");
    if (!raw) return new Set();
    const entries = JSON.parse(raw) as { name?: string; trackId?: string; timestamp?: number }[];
    const now = Date.now();
    const windowMs = 7 * 24 * 60 * 60 * 1000;
    return new Set(
      entries
        .filter((e) => e.timestamp && now - e.timestamp < windowMs)
        .map((e) => (e.name ?? "").toLowerCase()),
    );
  } catch {
    return new Set();
  }
}

export function getDynamicSongs(
  intent: SongIntent,
  language: SongLanguage,
  weather: WeatherVibe,
): Song[] {
  const pool = SONG_POOL[intent]?.[language] ?? [];
  if (pool.length === 0) return [];

  const recentKeys = getRecentlyPlayedSongKeys();
  const rotationSeed = getRotationSeed();

  const fresh = pool.filter((song) => !recentKeys.has(song.title.toLowerCase()));
  const source = fresh.length >= 4 ? fresh : pool;

  const rotated = seededShuffle(source, rotationSeed);

  const weatherConfig = WEATHER_ENERGY_MAP[weather];
  const scored = rotated.map((song) => {
    const colorLightness = parseFloat(song.color.match(/oklch\(([\d.]+)/)?.[1] ?? "0.5");
    const energyScore = colorLightness;
    const weatherFit =
      weatherConfig.sortKey === "calm"
        ? 1 - Math.abs(energyScore - weatherConfig.filter)
        : Math.abs(energyScore - weatherConfig.filter);
    return { song, score: weatherFit + Math.random() * 0.3 };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map((s) => s.song);
}

export function getVibeHeadline(
  intent: SongIntent,
  weather: WeatherVibe,
  language: SongLanguage,
): string {
  const langLabel = LANGUAGE_OPTIONS.find((l) => l.key === language)?.label || "Global";
  const weatherLabel = WEATHER_OPTIONS.find((w) => w.key === weather)?.label || "";
  return `${langLabel} ${weatherLabel.toLowerCase()} ${intent} vibes`;
}
