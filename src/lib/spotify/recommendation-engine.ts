import fs from "fs";
import path from "path";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CATEGORIES, pickCategoryForIntentWeather } from "./categories";
import { getLanguageProfile, LanguageCode } from "./language-profiles";
import { getRegionalCategoriesByLanguage } from "./regional-categories";

const RECENT_PATH = path.join(process.cwd(), "data", "spotify-recent.json");
const MAX_RECENT = 500;

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.access_token ?? null;
}

function readRecentIds(): string[] {
  try {
    const raw = fs.readFileSync(RECENT_PATH, "utf-8");
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.slice(-MAX_RECENT);
  } catch {
    // file may not exist yet
  }
  return [];
}

function writeRecentIds(ids: string[]) {
  try {
    const toWrite = ids.slice(-MAX_RECENT);
    fs.mkdirSync(path.dirname(RECENT_PATH), { recursive: true });
    fs.writeFileSync(RECENT_PATH, JSON.stringify(toWrite, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write recent spotify ids", e);
  }
}

async function searchArtistIds(token: string, names: string[]) {
  const ids: string[] = [];
  for (const name of names) {
    try {
      const params = new URLSearchParams({ q: name, type: "artist", limit: "1" });
      const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const id = json.artists?.items?.[0]?.id;
      if (id) ids.push(id);
    } catch {
      // artist search failures are non-critical
    }
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

function generateRandomSeeds(profile: (typeof CATEGORIES)[0]): {
  genres: string[];
  artists: string[];
} {
  const genreCount = 1 + Math.floor(Math.random() * 3); // 1-3
  const genres = sample(
    profile.seed_genres ?? [],
    Math.min(genreCount, profile.seed_genres.length),
  );
  const artistCount = Math.floor(Math.random() * 3); // 0-2
  const artists = sample(
    profile.seed_artists ?? [],
    Math.min(artistCount, (profile.seed_artists ?? []).length),
  );
  return { genres, artists };
}

/**
 * Emotional context weighting — adjusts audio targets based on the user's
 * current mood so that recommendations feel emotionally adaptive.
 */
const MOOD_AUDIO_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  calm: { energy: -0.15, valence: 0.05, danceability: -0.1, acousticness: 0.15 },
  curious: { energy: 0.05, valence: 0.1, danceability: 0.05, instrumentalness: 0.1 },
  heavy: { energy: -0.2, valence: -0.15, acousticness: 0.2, tempo: -15 },
  hopeful: { energy: 0.1, valence: 0.2, danceability: 0.1 },
  restless: { energy: 0.15, valence: -0.05, danceability: 0.15, tempo: 10 },
  tender: { energy: -0.12, valence: 0.08, acousticness: 0.18, danceability: -0.1 },
};

function applyMoodWeighting(
  targets: Record<string, string>,
  mood?: string | null,
): Record<string, string> {
  if (!mood) return targets;
  const weights = MOOD_AUDIO_WEIGHTS[mood.toLowerCase()];
  if (!weights) return targets;

  const result = { ...targets };
  for (const [key, offset] of Object.entries(weights)) {
    const targetKey = `target_${key}`;
    if (targetKey in result) {
      const current = parseFloat(result[targetKey]);
      if (!isNaN(current)) {
        const isTempo = key === "tempo";
        const adjusted = isTempo
          ? Math.max(30, Math.round(current + (offset as number)))
          : Math.max(0, Math.min(1, current + (offset as number)));
        result[targetKey] = String(isTempo ? adjusted : Number(adjusted.toFixed(2)));
      }
    }
  }
  return result;
}

function applyTimeOfDayInfluence(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return Math.min(0.99, value + 0.08);
  if (hour >= 22 || hour < 4) return Math.max(0.0, value - 0.1);
  return value;
}

function buildTargetParameters(profile: (typeof CATEGORIES)[0]): Record<string, string> {
  const targets: Record<string, string> = {};
  const at = profile.audioTargets ?? {};

  if (typeof at.energy === "number") {
    const value = applyTimeOfDayInfluence(at.energy) ?? at.energy;
    const randomized = value + (Math.random() * 0.1 - 0.05); // ±5% variation
    targets["target_energy"] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.valence === "number") {
    const value = applyTimeOfDayInfluence(at.valence) ?? at.valence;
    const randomized = value + (Math.random() * 0.12 - 0.06); // ±6% variation
    targets["target_valence"] = String(Number(Math.max(0, Math.min(1, randomized)).toFixed(2)));
  }

  if (typeof at.danceability === "number") {
    const randomized = at.danceability + (Math.random() * 0.14 - 0.07); // ±7% variation
    targets["target_danceability"] = String(
      Number(Math.max(0, Math.min(1, randomized)).toFixed(2)),
    );
  }

  if (typeof at.acousticness === "number") {
    const randomized = at.acousticness + (Math.random() * 0.16 - 0.08); // ±8% variation
    targets["target_acousticness"] = String(
      Number(Math.max(0, Math.min(1, randomized)).toFixed(2)),
    );
  }

  if (typeof at.instrumentalness === "number") {
    const randomized = at.instrumentalness + (Math.random() * 0.16 - 0.08); // ±8% variation
    targets["target_instrumentalness"] = String(
      Number(Math.max(0, Math.min(1, randomized)).toFixed(2)),
    );
  }

  if (typeof at.tempo === "number") {
    const randomized = at.tempo + (Math.random() * 20 - 10); // ±10 BPM variation
    targets["target_tempo"] = String(Math.max(30, Math.round(randomized)));
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
  audio_features?: Record<string, number | string | null> | null;
};

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        intent: z.string().max(80),
        weather: z.string().max(80).nullable().optional(),
        language: z.string().max(40).nullable().optional(),
        mood: z.string().max(40).nullable().optional(),
        limit: z.number().min(1).max(50).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const token = await getSpotifyToken();
    if (!token) return { tracks: [] as RecommendationTrack[] };

    const intent = data.intent ?? "dreamy";
    const weather = data.weather ?? undefined;
    const requestedLang = (data.language ?? undefined) as string | undefined;
    const userMood = data.mood ?? undefined;
    const limit = data.limit ?? 12;

    let languageCode: LanguageCode = "en";
    if (requestedLang) {
      const langProfiles = await import("./language-profiles");
      if ((Object.keys(langProfiles.LANGUAGE_PROFILES) as string[]).includes(requestedLang)) {
        languageCode = requestedLang as LanguageCode;
      }
    } else {
      const langProfiles = await import("./language-profiles");
      const langs = Object.keys(langProfiles.LANGUAGE_PROFILES) as LanguageCode[];
      const nonEn = langs.filter((l) => l !== "en");
      languageCode = Math.random() > 0.45 ? nonEn[Math.floor(Math.random() * nonEn.length)] : "en";
    }
    const langProfile = getLanguageProfile(languageCode);

    const catKey = pickCategoryForIntentWeather(intent, weather);
    const profile = CATEGORIES.find((c) => c.key === catKey) ?? CATEGORIES[0];

    const regionalCandidates = getRegionalCategoriesByLanguage(languageCode);
    let regionalProfile = null as (typeof regionalCandidates)[0] | null;
    if (regionalCandidates && regionalCandidates.length) {
      const match = regionalCandidates.find(
        (r) =>
          r.emotion &&
          profile.emotion &&
          r.emotion.toLowerCase().includes((profile.emotion ?? "").toLowerCase()),
      );
      regionalProfile =
        match ?? regionalCandidates[Math.floor(Math.random() * regionalCandidates.length)];
    }

    const recent = readRecentIds();
    const results: RecommendationTrack[] = [];
    const seenIds = new Set<string>(recent);
    const seenArtists = new Map<string, number>();
    const triedConfigs = new Set<string>();
    const MAX_ARTIST_PER_BATCH = 2;

    const mergedProfile = { ...profile } as typeof profile;
    if (langProfile) {
      mergedProfile.seed_genres = Array.from(
        new Set([...(mergedProfile.seed_genres ?? []), ...langProfile.primary_genres]),
      );
      mergedProfile.seed_artists = Array.from(
        new Set([...(mergedProfile.seed_artists ?? []), ...langProfile.featured_artists]),
      );
      mergedProfile.audioTargets = mergedProfile.audioTargets ?? {};
      for (const [k, v] of Object.entries(langProfile.audioModifiers || {})) {
        const key = k.replace("Offset", "") as keyof typeof mergedProfile.audioTargets;
        const cur = mergedProfile.audioTargets[key] ?? 0.5;
        (mergedProfile.audioTargets as Record<string, number>)[key] = Math.max(
          0,
          Math.min(1, cur + (v as number)),
        );
      }
    }
    if (regionalProfile) {
      mergedProfile.seed_genres = Array.from(
        new Set([...(mergedProfile.seed_genres ?? []), ...regionalProfile.seed_genres]),
      );
      mergedProfile.seed_artists = Array.from(
        new Set([...(mergedProfile.seed_artists ?? []), ...(regionalProfile.seed_artists ?? [])]),
      );
      mergedProfile.audioTargets = {
        ...(mergedProfile.audioTargets ?? {}),
        ...(regionalProfile.audioTargets ?? {}),
      };
    }

    let targets = buildTargetParameters(mergedProfile);
    targets = applyMoodWeighting(targets, userMood);

    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts && results.length < limit; attempt++) {
      const { genres: seedGenres, artists: seedArtistNames } = generateRandomSeeds(mergedProfile);
      const seedArtistIds = seedArtistNames.length
        ? await searchArtistIds(token, seedArtistNames)
        : [];

      const configKey = `${seedGenres.join(",")}:${seedArtistIds.join(",")}`;
      if (triedConfigs.has(configKey)) continue;
      triedConfigs.add(configKey);

      const offset = attempt * 5 + Math.floor(Math.random() * 8);
      const market = langProfile?.searchMarket ?? "US";
      const params = new URLSearchParams({
        limit: String(Math.min(50, limit * 5)),
        market,
        offset: String(offset),
      });

      if (seedGenres.length) params.set("seed_genres", seedGenres.join(","));
      if (seedArtistIds.length) params.set("seed_artists", seedArtistIds.slice(0, 2).join(","));

      for (const [key, value] of Object.entries(targets)) {
        params.set(key, value);
      }

      if (languageCode && languageCode !== "en") {
        params.set("market", langProfile.searchMarket);
      }

      try {
        const res = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) continue;

        const json = await res.json();
        const tracks = json.tracks ?? [];

        for (const t of tracks) {
          if (!t || !t.id) continue;
          if (seenIds.has(t.id)) continue;

          const primaryArtist = ((t.artists ?? [])[0]?.name ?? "").toLowerCase();
          const artistCount = seenArtists.get(primaryArtist) ?? 0;
          if (artistCount >= MAX_ARTIST_PER_BATCH) continue;

          seenIds.add(t.id);
          seenArtists.set(primaryArtist, artistCount + 1);
          results.push({
            id: t.id,
            name: t.name,
            artists: (t.artists ?? []).map((a: { name: string }) => a.name),
            spotifyUrl: t.external_urls?.spotify ?? `https://open.spotify.com/track/${t.id}`,
            previewUrl: t.preview_url ?? null,
            albumImage: t.album?.images?.[0]?.url ?? null,
            audio_features: null,
          });

          if (results.length >= limit) break;
        }
      } catch {
        // continue on API errors
      }
    }

    const trackIds = results.map((r) => r.id).slice(0, 100);
    if (trackIds.length) {
      try {
        const f = await fetch(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (f.ok) {
          const jf = await f.json();
          const features = jf.audio_features ?? [];
          for (const r of results) {
            const af = features.find((a: { id: string } | null) => a && a.id === r.id);
            if (af) r.audio_features = af;
          }
        }
      } catch {
        // audio features fetch is non-critical
      }
    }

    const newRecent = recent.concat(results.map((r) => r.id));
    writeRecentIds(newRecent);

    const final = results.sort(() => Math.random() - 0.5).slice(0, limit);
    return { tracks: final };
  });
