/**
 * spotify.functions.ts
 * Server-side functions that call the Spotify Web API.
 * Uses Client Credentials flow — no user login required.
 *
 * If SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are missing, functions
 * return null gracefully so the UI can hide the feature.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getMoodQuery } from "./mood-to-playlist";

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  externalUrl: string;
  trackCount: number;
};

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
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export const getMoodPlaylists = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ mood: z.string().max(40).nullable().optional() }).parse(input)
  )
  .handler(async ({ data }): Promise<SpotifyPlaylist[] | null> => {
    const token = await getSpotifyToken();
    if (!token) return null; // Spotify not configured — UI should hide

    const query = getMoodQuery(data.mood);
    const params = new URLSearchParams({
      q: query,
      type: "playlist",
      limit: "4",
      market: "US",
    });

    const res = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return null;

    const json = (await res.json()) as {
      playlists?: {
        items?: Array<{
          id: string;
          name: string;
          description: string;
          images?: Array<{ url: string }>;
          external_urls?: { spotify?: string };
          tracks?: { total: number };
        }>;
      };
    };

    const items = json.playlists?.items ?? [];
    return items
      .filter(Boolean)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description?.replace(/<[^>]*>/g, "") ?? "",
        imageUrl: p.images?.[0]?.url ?? null,
        externalUrl: p.external_urls?.spotify ?? `https://open.spotify.com/playlist/${p.id}`,
        trackCount: p.tracks?.total ?? 0,
      }));
  });
