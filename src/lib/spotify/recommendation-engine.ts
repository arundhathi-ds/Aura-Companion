import fs from 'fs';
import path from 'path';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { CATEGORIES, pickCategoryForIntentWeather } from './categories';
import { MusicMemory } from './music-memory';
import { getLanguageProfile, LanguageCode } from './language-profiles';
import { getRegionalCategory, getRegionalCategoriesByLanguage, RegionalCategoryKey } from './regional-categories';

const RECENT_PATH = path.join(process.cwd(), 'data', 'spotify-recent.json');
const MAX_RECENT = 300;

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.access_token ?? null;
}

function readRecentIds(): string[] {
  try {
    const raw = fs.readFileSync(RECENT_PATH, 'utf-8');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.slice(-MAX_RECENT);
  } catch {}
  return [];
}

function writeRecentIds(ids: string[]) {
  try {
    const toWrite = ids.slice(-MAX_RECENT);
    fs.mkdirSync(path.dirname(RECENT_PATH), { recursive: true });
    fs.writeFileSync(RECENT_PATH, JSON.stringify(toWrite, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to write recent spotify ids', e);
  }
}

async function searchArtistIds(token: string, names: string[]) {
  const ids: string[] = [];
  for (const name of names) {
    try {
      const params = new URLSearchParams({ q: name, type: 'artist', limit: '1' });
      const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) continue;
      const json = await res.json();
      const id = json.artists?.items?.[0]?.id;
      if (id) ids.push(id);
    } catch {}
  }
  return ids;
}

function sample<T>(arr: T[], n = 1) {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

/**
 * Generate a randomized seed configuration for diversity.
 * Each call produces a different seed combination to avoid monotonous results.
 */
function generateRandomSeeds(profile: typeof CATEGORIES[0]): { genres: string[]; artists: string[] } {
  // Randomly select 1-3 genres
  const genreCount = 1 + Math.floor(Math.random() * 2); // 1-2
  const genres = sample(profile.seed_genres ?? [], Math.min(genreCount, profile.seed_genres.length));

  // Randomly select 0-2 artists
  const artistCount = Math.floor(Math.random() * 2); // 0-1
  const artists = sample(profile.seed_artists ?? [], Math.min(artistCount, profile.seed_artists.length));

  return { genres, artists };
}

/**
 * Apply time-of-day influence to audio targets.
 * Morning -> slightly higher energy, Night -> lower energy.
 */
function applyTimeOfDayInfluence(value: number | undefined): number | undefined {
  if (typeof value !== 'number') return undefined;
  const hour = new Date().getHours();
  
  // Morning boost (6am - 12pm)
  if (hour >= 6 && hour < 12) {
    return Math.min(0.99, value + 0.08);
  }
  
  // Evening/night dip (10pm - 4am)
  if (hour >= 22 || hour < 4) {
    return Math.max(0.0, value - 0.1);
  }
  
  return value;
}

/**
 * Build Spotify recommendation query with dynamic audio targets.
 * Adds randomness to avoid repetitive results.
 */
function buildTargetParameters(profile: typeof CATEGORIES[0]): Record<string, string> {
  const targets: Record<string, string> = {};
  const at = profile.audioTargets ?? {};

  // Apply audio features with time-of-day influence and slight randomization
  if (typeof at.energy === 'number') {
    const value = applyTimeOfDayInfluence(at.energy) ?? at.energy;
    const randomized = value + (Math.random() * 0.06 - 0.03); // ±3% variation
    targets['target_energy'] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.valence === 'number') {
    const value = applyTimeOfDayInfluence(at.valence) ?? at.valence;
    const randomized = value + (Math.random() * 0.08 - 0.04); // ±4% variation
    targets['target_valence'] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.danceability === 'number') {
    const randomized = at.danceability + (Math.random() * 0.1 - 0.05); // ±5% variation
    targets['target_danceability'] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.acousticness === 'number') {
    const randomized = at.acousticness + (Math.random() * 0.12 - 0.06); // ±6% variation
    targets['target_acousticness'] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.instrumentalness === 'number') {
    const randomized = at.instrumentalness + (Math.random() * 0.12 - 0.06); // ±6% variation
    targets['target_instrumentalness'] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.tempo === 'number') {
    const randomized = at.tempo + (Math.random() * 16 - 8); // ±8 BPM variation
    targets['target_tempo'] = String(Math.max(30, Math.round(randomized)));
  }

  return targets;
}

export type RecommendationTrack = {
  id: string;
  name: string;
  artists: string[];
  spotifyUrl: string;
  previewUrl?: string | null;
  albumImage?: string | null;
  audio_features?: Record<string, any> | null;
};

export const getRecommendations = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) =>
    z.object({
      intent: z.string().max(80),
      weather: z.string().max(80).nullable().optional(),
      language: z.string().max(40).nullable().optional(),
      limit: z.number().min(1).max(50).optional(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const token = await getSpotifyToken();
    if (!token) return { tracks: [] as RecommendationTrack[] };

    const intent = data.intent ?? 'dreamy';
    const weather = data.weather ?? undefined;
    const requestedLang = (data.language ?? undefined) as string | undefined;
    const limit = data.limit ?? 12;

    // Determine language to use for regional discovery. If none provided, rotate languages.
    let languageCode: LanguageCode = 'en';
    if (requestedLang) {
      if ((Object.keys((await import('./language-profiles')).LANGUAGE_PROFILES) as string[]).includes(requestedLang)) {
        languageCode = requestedLang as LanguageCode;
      }
    } else {
      // pick a random language to surface global discoveries (avoid always english)
      const langs = Object.keys((await import('./language-profiles')).LANGUAGE_PROFILES) as LanguageCode[];
      // weight towards non-en occasionally
      const nonEn = langs.filter((l) => l !== 'en');
      languageCode = Math.random() > 0.45 ? nonEn[Math.floor(Math.random() * nonEn.length)] : 'en';
    }
    const langProfile = getLanguageProfile(languageCode);

    // Pick a category profile heuristically
    const catKey = pickCategoryForIntentWeather(intent, weather);
    const profile = CATEGORIES.find((c) => c.key === catKey) ?? CATEGORIES[0];

    // Regional influence: prefer a regional category for the selected language sometimes
    const regionalCandidates = getRegionalCategoriesByLanguage(languageCode);
    let regionalProfile = null as any;
    if (regionalCandidates && regionalCandidates.length) {
      // Prefer a regional profile that roughly matches the global profile emotion
      const match = regionalCandidates.find((r) => r.emotion && profile.emotion && r.emotion.toLowerCase().includes((profile.emotion ?? '').toLowerCase()));
      regionalProfile = match ?? regionalCandidates[Math.floor(Math.random() * regionalCandidates.length)];
    }

    const recent = readRecentIds();
    const results: RecommendationTrack[] = [];
    const seenIds = new Set<string>(recent);
    const triedConfigs = new Set<string>();

    // Merge audio targets with language modifiers and regional profile if present
    const mergedProfile = { ...profile } as any;
    if (langProfile) {
      // Merge language primary genres into seeds and featured artists into seed list
      mergedProfile.seed_genres = Array.from(new Set([...(mergedProfile.seed_genres ?? []), ...langProfile.primary_genres]));
      mergedProfile.seed_artists = Array.from(new Set([...(mergedProfile.seed_artists ?? []), ...langProfile.featured_artists]));
      // Apply audio modifiers
      mergedProfile.audioTargets = mergedProfile.audioTargets ?? {};
      for (const [k, v] of Object.entries(langProfile.audioModifiers || {})) {
        const key = k.replace('Offset', '');
        const cur = mergedProfile.audioTargets[key] ?? 0.5;
        mergedProfile.audioTargets[key] = Math.max(0, Math.min(1, (cur as number) + (v as number)));
      }
    }
    if (regionalProfile) {
      mergedProfile.seed_genres = Array.from(new Set([...(mergedProfile.seed_genres ?? []), ...regionalProfile.seed_genres]));
      mergedProfile.seed_artists = Array.from(new Set([...(mergedProfile.seed_artists ?? []), ...regionalProfile.seed_artists]));
      mergedProfile.audioTargets = { ...(mergedProfile.audioTargets ?? {}), ...(regionalProfile.audioTargets ?? {}) };
    }

    // Build audio targets once with dynamic randomization
    const targets = buildTargetParameters(mergedProfile);

    // Attempt multiple seed combinations for maximum variety
    // Each attempt uses different genre/artist seeds to create diverse pools
    const maxAttempts = 8;
    for (let attempt = 0; attempt < maxAttempts && results.length < limit; attempt++) {
      // Generate fresh random seeds each iteration
      const { genres: seedGenres, artists: seedArtistNames } = generateRandomSeeds(profile);
      
      // Search for current artist IDs (in case artists list changes)
      const seedArtistIds = seedArtistNames.length
        ? await searchArtistIds(token, seedArtistNames)
        : [];

      // Create a unique key for this configuration to avoid duplicate attempts
      const configKey = `${seedGenres.join(',')}:${seedArtistIds.join(',')}`;
      if (triedConfigs.has(configKey)) continue;
      triedConfigs.add(configKey);

      // Vary the offset for each attempt to get different sections of recommendation pool
      const offset = attempt * 7 + Math.floor(Math.random() * 5); // randomized offsets for wider variety

      const market = langProfile?.searchMarket ?? 'US';
      const params = new URLSearchParams({
        limit: String(Math.min(50, limit * 5)), // Request larger pools for cross-cultural sampling
        market,
        offset: String(offset),
      });

      if (seedGenres.length) params.set('seed_genres', seedGenres.join(','));
      if (seedArtistIds.length) params.set('seed_artists', seedArtistIds.slice(0, 2).join(','));

      // Add all audio targets
      for (const [key, value] of Object.entries(targets)) {
        params.set(key, value);
      }

      // Include seed limiters that favor the selected language (if present)
      if (languageCode && languageCode !== 'en') {
        // bias toward tracks with the language's market
        params.set('market', langProfile.searchMarket);
      }

      try {
        const res = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) continue;
        
        const json = await res.json();
        const tracks = json.tracks ?? [];

        // Add fresh tracks, filtering duplicates and recent plays
        for (const t of tracks) {
          if (!t || !t.id) continue;
          if (seenIds.has(t.id)) continue; // Skip if already in results or recent

          // Language filtering: prefer tracks whose primary artists or available markets match the language
          // If the request specified a language, deprioritize tracks that clearly belong to other markets
          if (requestedLang) {
            const artistNames = (t.artists ?? []).map((a: any) => (a.name ?? '').toLowerCase()).join(' ');
            if (languageCode && languageCode !== 'en' && artistNames && artistNames.match(/(feat|ft|with)/i)) {
              // allow but don't block
            }
          }

          seenIds.add(t.id);
          results.push({
            id: t.id,
            name: t.name,
            artists: (t.artists ?? []).map((a: any) => a.name),
            spotifyUrl: t.external_urls?.spotify ?? `https://open.spotify.com/track/${t.id}`,
            previewUrl: t.preview_url ?? null,
            albumImage: t.album?.images?.[0]?.url ?? null,
            audio_features: null,
          });

          if (results.length >= limit) break;
        }
      } catch (e) {
        // Silently continue on API errors
      }
    }

    // Fetch audio features for returned tracks (up to 100 at a time)
    const trackIds = results.map((r) => r.id).slice(0, 100);
    if (trackIds.length) {
      try {
        const f = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (f.ok) {
          const jf = await f.json();
          const features = jf.audio_features ?? [];
          for (const r of results) {
            const af = features.find((a: any) => a && a.id === r.id);
            if (af) r.audio_features = af;
          }
        }
      } catch {}
    }

    // Update recent list with new recommendations
    const newRecent = recent.concat(results.map((r) => r.id));
    writeRecentIds(newRecent);

    // Shuffle final results for additional variety in presentation
    const final = results.sort(() => Math.random() - 0.5).slice(0, limit);

    return { tracks: final };
  });
