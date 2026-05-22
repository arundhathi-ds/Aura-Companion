/**
 * Regional Category Profiles
 * Language-specific and region-specific emotional music atmospheres.
 * These create a truly global emotional music universe.
 */

import { CategoryProfile } from './categories';
import { LanguageCode } from './language-profiles';

export type RegionalCategoryKey =
  // Indian Industries
  | 'tamil-vibes'
  | 'malayalam-soul'
  | 'telugu-nights'
  | 'bollywood-after-dark'
  | 'indie-india'
  // East Asian
  | 'seoul-midnight'
  | 'tokyo-neon'
  | 'anime-dreamscapes'
  | 'k-indie-nights'
  | 'city-pop-rain'
  // Middle Eastern
  | 'arabic-moonlight'
  | 'oud-electronic-fusion'
  | 'cairo-after-dark'
  // Latin & Global
  | 'latin-fire'
  | 'bossa-introspection'
  | 'spanish-cinema'
  | 'afro-rhythms'
  | 'underground-global';

export interface RegionalCategory extends CategoryProfile {
  languages: LanguageCode[];
  region: string;
  culturalNotes: string;
}

export const REGIONAL_CATEGORIES: RegionalCategory[] = [
  // INDIAN INDUSTRIES
  {
    key: 'tamil-vibes',
    label: 'Tamil Vibes',
    emotion: 'Nostalgic Cinema',
    description: 'Old film magic meets modern indie rebellion',
    languages: ['ta'],
    region: 'South Asia',
    culturalNotes: 'Tamil music carries the soul of southern Indian cinema and independent artists.',
    seed_genres: [
      'tamil-indie',
      'tamil-film',
      'desi-indie',
      'carnatic-fusion',
      'tamil-folk-electronic',
    ],
    seed_artists: [
      'Santhosh Narayanan',
      'Anirudh Ravichander',
      'GV Prakash Kumar',
      'Uyire',
      'Kaaveri',
    ],
    audioTargets: {
      energy: 0.45,
      valence: 0.48,
      danceability: 0.35,
      acousticness: 0.5,
      instrumentalness: 0.25,
      tempo: 95,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)',
      tint: '#d4945c',
    },
    companionLine: 'This night feels like old Tamil melodies dancing in rain.',
  },
  {
    key: 'malayalam-soul',
    label: 'Malayalam Soul',
    emotion: 'Poetic Reflection',
    description: 'Deep, introspective, emotionally resonant',
    languages: ['ml'],
    region: 'South Asia',
    culturalNotes:
      'Malayalam cinema is known for emotional depth and layered storytelling.',
    seed_genres: [
      'malayalam-indie',
      'kerala-folk',
      'malayalam-film',
      'keralam-electronic',
    ],
    seed_artists: [
      'Shaan Rahman',
      'Sushin Shyam',
      'Govind Vasantha',
      'Travelogue',
    ],
    audioTargets: {
      energy: 0.35,
      valence: 0.40,
      danceability: 0.15,
      acousticness: 0.65,
      instrumentalness: 0.35,
      tempo: 75,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #0a3a3a 0%, #051a1a 100%)',
      tint: '#6ee7b7',
    },
    companionLine: 'Kerala whispers stories only the rain understands.',
  },
  {
    key: 'telugu-nights',
    label: 'Telugu Nights',
    emotion: 'Vibrant Energy',
    description: 'Pulsing with rhythm and dynamic soul',
    languages: ['te'],
    region: 'South Asia',
    culturalNotes: 'Telugu cinema brings grand emotions and vibrant energy.',
    seed_genres: [
      'telugu-indie',
      'telugu-film',
      'hyderabad-electronic',
      'telugu-folk',
    ],
    seed_artists: ['Thaman S', 'M. M. Keeravani', 'Mani Osai', 'Pritam'],
    audioTargets: {
      energy: 0.65,
      valence: 0.55,
      danceability: 0.48,
      acousticness: 0.25,
      instrumentalness: 0.2,
      tempo: 115,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #2d1b4e 0%, #1a0f2e 100%)',
      tint: '#c084fc',
    },
    companionLine: 'The Deccan plains sing with electric passion.',
  },
  {
    key: 'bollywood-after-dark',
    label: 'Bollywood After Dark',
    emotion: 'Romantic Intensity',
    description: 'Cinematic passion meets urban rebellion',
    languages: ['hi'],
    region: 'South Asia',
    culturalNotes: 'Bollywood transforms emotion into spectacle and music.',
    seed_genres: [
      'bollywood',
      'neo-bollywood',
      'hindi-indie',
      'hindi-electronic',
      'hindi-trap',
    ],
    seed_artists: [
      'A.R. Rahman',
      'Amit Trivedi',
      'Vishal Bhardwaj',
      'Nucleya',
      'Divine',
    ],
    audioTargets: {
      energy: 0.72,
      valence: 0.62,
      danceability: 0.65,
      acousticness: 0.15,
      instrumentalness: 0.15,
      tempo: 125,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #4c0519 0%, #2a0f1a 100%)',
      tint: '#f472b6',
    },
    companionLine: 'Mumbai nights pulse with Bollywood dreams and rebellion.',
  },
  {
    key: 'indie-india',
    label: 'Indie India',
    emotion: 'Contemporary Pulse',
    description: 'Modern Indian indie, underground, and experimental',
    languages: ['hi', 'ta', 'ml', 'te'],
    region: 'South Asia',
    culturalNotes: 'India\'s independent music scene is vibrant and globally influential.',
    seed_genres: [
      'indian-indie',
      'indietronica',
      'hindi-indie-pop',
      'south-asian-indie',
    ],
    seed_artists: [
      'Seedhe Maut',
      'Ritviz',
      'Prateek Kuhad',
      'When Chai Met Toast',
      'Dhruv',
    ],
    audioTargets: {
      energy: 0.68,
      valence: 0.52,
      danceability: 0.55,
      acousticness: 0.28,
      instrumentalness: 0.22,
      tempo: 110,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a2e3a 0%, #0f1820 100%)',
      tint: '#8b5cf6',
    },
    companionLine: 'India\'s independent spirit speaks in a thousand dialects.',
  },

  // EAST ASIAN
  {
    key: 'seoul-midnight',
    label: 'Seoul After Midnight',
    emotion: 'Polished Melancholy',
    description: 'K-R&B and emotional indie ballads under neon',
    languages: ['ko'],
    region: 'East Asia',
    culturalNotes: 'Seoul\'s music scene blends meticulous production with emotional depth.',
    seed_genres: ['k-rnb', 'korean-indie-rock', 'korean-ballad', 'k-indie'],
    seed_artists: [
      'IU',
      'Taeyeon',
      'Zion.T',
      'AKMU',
      'Epik High',
    ],
    audioTargets: {
      energy: 0.42,
      valence: 0.38,
      danceability: 0.32,
      acousticness: 0.35,
      instrumentalness: 0.2,
      tempo: 85,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
      tint: '#00ff88',
    },
    companionLine: 'Seoul whispers secrets only the neon lights understand.',
  },
  {
    key: 'tokyo-neon',
    label: 'Tokyo Neon',
    emotion: 'Cyberpunk Serenity',
    description: 'City pop, anime instrumentals, vaporwave dreams',
    languages: ['ja'],
    region: 'East Asia',
    culturalNotes:
      'Tokyo\'s aesthetic influences music from city-pop to vaporwave.',
    seed_genres: ['city-pop', 'vaporwave', 'japanese-indie', 'shoegaze-jp'],
    seed_artists: [
      'Mariya Takeuchi',
      'Nujabes',
      'Cornelius',
      'Eve',
      'Chara',
    ],
    audioTargets: {
      energy: 0.35,
      valence: 0.32,
      danceability: 0.28,
      acousticness: 0.15,
      instrumentalness: 0.45,
      tempo: 90,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #0a0e27 0%, #1a0f3a 100%)',
      tint: '#a78bfa',
    },
    companionLine: 'Tokyo glows with a gentle, introspective light.',
  },
  {
    key: 'anime-dreamscapes',
    label: 'Anime Dreamscapes',
    emotion: 'Ethereal Wonder',
    description: 'Instrumental anime soundtracks and Japanese orchestral fusion',
    languages: ['ja'],
    region: 'East Asia',
    culturalNotes: 'Anime music creates entire emotional worlds through sound.',
    seed_genres: ['anime-soundtrack', 'japanese-orchestral', 'instrumental-jp'],
    seed_artists: [
      'Yoko Kanno',
      'Joe Hisaishi',
      'Keiji Kawakubo',
      'Sakamoto Ryuichi',
    ],
    audioTargets: {
      energy: 0.32,
      valence: 0.40,
      danceability: 0.08,
      acousticness: 0.25,
      instrumentalness: 0.92,
      tempo: 72,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a0a2e 0%, #0a0520 100%)',
      tint: '#d8b4fe',
    },
    companionLine: 'Dreams have a soundtrack in Japanese.',
  },
  {
    key: 'k-indie-nights',
    label: 'K-Indie Nights',
    emotion: 'Artistic Rebellion',
    description: 'Korean indie rock, experimental, and alternative scenes',
    languages: ['ko'],
    region: 'East Asia',
    culturalNotes:
      'Korea\'s indie scene challenges conventions with artistic integrity.',
    seed_genres: ['korean-indie-rock', 'korean-electronic', 'k-alternative'],
    seed_artists: [
      'Hyukoh',
      'Day6',
      'Sunmi',
      'Oh My Girl',
      'The Black Skirts',
    ],
    audioTargets: {
      energy: 0.62,
      valence: 0.48,
      danceability: 0.42,
      acousticness: 0.22,
      instrumentalness: 0.15,
      tempo: 102,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #2d1b4e 0%, #1a0f2e 100%)',
      tint: '#f97316',
    },
    companionLine: 'Korean indie artists paint feelings with experimental sound.',
  },
  {
    key: 'city-pop-rain',
    label: 'City Pop Rain',
    emotion: 'Nostalgic Groove',
    description: 'Smooth Japanese city-pop and R&B fusions',
    languages: ['ja'],
    region: 'East Asia',
    culturalNotes: 'City-pop is a distinctly Japanese fusion of funk, soul, and electronic.',
    seed_genres: ['city-pop', 'japanese-rnb', 'funk-jp', 'smooth-jazz-jp'],
    seed_artists: [
      'Mariya Takeuchi',
      'Tatsuro Yamashita',
      'Junko Ohashi',
      'Minako Yoshida',
    ],
    audioTargets: {
      energy: 0.48,
      valence: 0.55,
      danceability: 0.62,
      acousticness: 0.12,
      instrumentalness: 0.25,
      tempo: 98,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a2a3a 0%, #0f1820 100%)',
      tint: '#06b6d4',
    },
    companionLine: 'Rain falls softly on neon-lit Tokyo rooftops.',
  },

  // MIDDLE EASTERN
  {
    key: 'arabic-moonlight',
    label: 'Arabic Moonlight',
    emotion: 'Poetic Mystique',
    description: 'Atmospheric oud, neo-Arabic, and electronic fusion',
    languages: ['ar'],
    region: 'Middle East',
    culturalNotes:
      'Arabic music blends ancient traditions with contemporary sound design.',
    seed_genres: [
      'arabic-indie',
      'neo-arabic',
      'arabic-electronic',
      'oud-fusion',
    ],
    seed_artists: [
      'Mashrou Leila',
      'Dina Hayek',
      'Cairokee',
      'Abou Debeing',
    ],
    audioTargets: {
      energy: 0.38,
      valence: 0.42,
      danceability: 0.25,
      acousticness: 0.62,
      instrumentalness: 0.35,
      tempo: 80,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a0d2e 0%, #0d0620 100%)',
      tint: '#f97316',
    },
    companionLine: 'The desert carries ancient melodies and eternal songs.',
  },
  {
    key: 'oud-electronic-fusion',
    label: 'Oud & Electronic',
    emotion: 'Sacred-Digital Blend',
    description: 'Traditional instruments meet modern production',
    languages: ['ar'],
    region: 'Middle East',
    culturalNotes:
      'This fusion creates bridge between centuries of Arabian music tradition.',
    seed_genres: [
      'oud-fusion',
      'middle-eastern-electronic',
      'neo-classical-arabic',
    ],
    seed_artists: [
      'Omar Khairat',
      'Oum',
      'Ballaké Sissoko',
      'Mohamed Fadl',
    ],
    audioTargets: {
      energy: 0.35,
      valence: 0.38,
      danceability: 0.12,
      acousticness: 0.72,
      instrumentalness: 0.65,
      tempo: 68,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #0d1a2e 0%, #050810 100%)',
      tint: '#fbbf24',
    },
    companionLine: 'Ancient strings resonate with digital dreams.',
  },
  {
    key: 'cairo-after-dark',
    label: 'Cairo After Dark',
    emotion: 'Urban Spirit',
    description: 'Egyptian hip-hop, mahraganat, and underground scenes',
    languages: ['ar'],
    region: 'Middle East',
    culturalNotes:
      'Cairo\'s underground music speaks truth to power with raw energy.',
    seed_genres: ['mahraganat', 'egyptian-rap', 'cairo-underground'],
    seed_artists: ['Dina Hayek', 'Cairokee', 'Fateh', 'Sharmoofers'],
    audioTargets: {
      energy: 0.78,
      valence: 0.52,
      danceability: 0.68,
      acousticness: 0.08,
      instrumentalness: 0.18,
      tempo: 128,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #2a1020 0%, #1a0810 100%)',
      tint: '#ec4899',
    },
    companionLine: 'Cairo\'s streets pulse with untamed artistic rebellion.',
  },

  // LATIN & GLOBAL
  {
    key: 'latin-fire',
    label: 'Latin Fire',
    emotion: 'Passionate Energy',
    description: 'Reggaeton, latin-trap, and contemporary Latin vibes',
    languages: ['es', 'pt'],
    region: 'Latin America',
    culturalNotes: 'Latin music pulses with infectious rhythm and passionate expression.',
    seed_genres: [
      'reggaeton',
      'latin-trap',
      'latin-electronic',
      'trap-latino',
    ],
    seed_artists: [
      'Bad Bunny',
      'J Balvin',
      'Rosalía',
      'Rauw Alejandro',
      'Tokischa',
    ],
    audioTargets: {
      energy: 0.82,
      valence: 0.68,
      danceability: 0.85,
      acousticness: 0.05,
      instrumentalness: 0.08,
      tempo: 135,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #2e1810 0%, #1a0f08 100%)',
      tint: '#f59e0b',
    },
    companionLine: 'Latin fire burns in every heartbeat.',
  },
  {
    key: 'bossa-introspection',
    label: 'Bossa Introspection',
    emotion: 'Soulful Groove',
    description: 'Brazilian bossa-nova, samba, and tropicalia modern reimaginings',
    languages: ['pt'],
    region: 'Latin America',
    culturalNotes:
      'Brazilian music flows like water, always moving, always alive.',
    seed_genres: [
      'bossa-nova',
      'samba-indie',
      'tropicalia-modern',
      'brazilian-soul',
    ],
    seed_artists: [
      'Tom Jobim',
      'Gilberto Gil',
      'Liniker',
      'BaianaSystem',
      'Emicida',
    ],
    audioTargets: {
      energy: 0.52,
      valence: 0.58,
      danceability: 0.48,
      acousticness: 0.48,
      instrumentalness: 0.22,
      tempo: 92,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a3a2e 0%, #0f2520 100%)',
      tint: '#10b981',
    },
    companionLine: 'Brazil flows with eternal rhythm and soul.',
  },
  {
    key: 'spanish-cinema',
    label: 'Spanish Cinema',
    emotion: 'Artistic Passion',
    description: 'Spanish indie, flamenco fusion, and Iberian electronic',
    languages: ['es'],
    region: 'Iberia',
    culturalNotes:
      'Spain blends tradition with innovation in passionate artistic expression.',
    seed_genres: [
      'spanish-indie',
      'flamenco-fusion',
      'iberian-electronic',
      'spanish-folk-modern',
    ],
    seed_artists: [
      'Rosalía',
      'Cultura Profética',
      'Zahara',
      'Jorge Drexler',
    ],
    audioTargets: {
      energy: 0.62,
      valence: 0.52,
      danceability: 0.45,
      acousticness: 0.35,
      instrumentalness: 0.18,
      tempo: 105,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #3a1a2a 0%, #2a0f1a 100%)',
      tint: '#dc2626',
    },
    companionLine: 'Spain dances between tradition and artistic rebellion.',
  },
  {
    key: 'afro-rhythms',
    label: 'Afro Rhythms',
    emotion: 'Ancestral Pulse',
    description: 'Afrobeats, Afroelectric, and contemporary African sounds',
    languages: ['en'],
    region: 'Africa',
    culturalNotes:
      'African music carries generations of rhythm and cultural pride.',
    seed_genres: [
      'afrobeats',
      'afro-electronic',
      'african-house',
      'nigerian-hip-hop',
    ],
    seed_artists: [
      'Wizkid',
      'Burna Boy',
      'Yemi Alade',
      'Amyl and The Sniffers',
      'CKay',
    ],
    audioTargets: {
      energy: 0.75,
      valence: 0.65,
      danceability: 0.78,
      acousticness: 0.15,
      instrumentalness: 0.12,
      tempo: 120,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #1a2a1a 0%, #0f1810 100%)',
      tint: '#eab308',
    },
    companionLine: 'Africa\'s rhythm is the heartbeat of the world.',
  },
  {
    key: 'underground-global',
    label: 'Underground Global',
    emotion: 'Raw Authenticity',
    description: 'Underrated indie artists from around the world',
    languages: ['en', 'es', 'ja', 'ko', 'ta', 'hi'],
    region: 'Global',
    culturalNotes:
      'The underground holds the most authentic voices and freshest sounds.',
    seed_genres: [
      'underground',
      'indie-global',
      'experimental',
      'lo-fi-hip-hop',
    ],
    seed_artists: [
      'Small indie artists from every continent',
      'Bandcamp discoveries',
      'DIY electronic producers',
      'Underground collectives',
    ],
    audioTargets: {
      energy: 0.55,
      valence: 0.48,
      danceability: 0.42,
      acousticness: 0.32,
      instrumentalness: 0.28,
      tempo: 95,
    },
    visual: {
      gradient: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
      tint: '#a0aec0',
    },
    companionLine: 'The underground is where true art breathes.',
  },
];

export function getRegionalCategory(key: RegionalCategoryKey): RegionalCategory | null {
  return REGIONAL_CATEGORIES.find((c) => c.key === key) || null;
}

export function getRegionalCategoriesByLanguage(languageCode: LanguageCode): RegionalCategory[] {
  return REGIONAL_CATEGORIES.filter((c) => c.languages.includes(languageCode));
}

export function getRegionalCategoriesByRegion(region: string): RegionalCategory[] {
  return REGIONAL_CATEGORIES.filter((c) => c.region === region);
}

export default REGIONAL_CATEGORIES;
