/**
 * Music Memory System
 * Tracks recently recommended/played tracks to ensure freshness and variety.
 * Prevents repetition and enables intelligent recommendation rotation.
 * Includes artist fatigue detection and session-aware diversity.
 */

export interface MusicMemoryEntry {
  trackId: string;
  name: string;
  timestamp: number;
  categoryKey: string;
  artist: string;
}

const STORAGE_KEY = "aura_music_memory";
const MAX_MEMORY = 500;
const EXPIRY_DAYS = 7;
const ARTIST_FATIGUE_THRESHOLD = 3;
const SESSION_KEY = "aura_music_session";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export class MusicMemory {
  private static getMemory(): MusicMemoryEntry[] {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static setMemory(entries: MusicMemoryEntry[]): void {
    try {
      if (typeof window === "undefined") return;
      const trimmed = entries.slice(-MAX_MEMORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      console.warn("Failed to save music memory");
    }
  }

  private static getSessionTracks(): Set<string> {
    try {
      if (typeof window === "undefined") return new Set();
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return new Set();
      const data = JSON.parse(raw);
      if (Date.now() - data.startedAt > SESSION_DURATION_MS) {
        localStorage.removeItem(SESSION_KEY);
        return new Set();
      }
      return new Set(data.trackIds ?? []);
    } catch {
      return new Set();
    }
  }

  private static addToSession(trackIds: string[]): void {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(SESSION_KEY);
      let data = { startedAt: Date.now(), trackIds: [] as string[] };
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.startedAt <= SESSION_DURATION_MS) {
          data = parsed;
        }
      }
      data.trackIds = [...new Set([...data.trackIds, ...trackIds])].slice(-200);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {
      // noop
    }
  }

  static recordTrack(trackId: string, name: string, categoryKey: string, artist: string): void {
    const memory = this.getMemory();
    memory.push({
      trackId,
      name,
      timestamp: Date.now(),
      categoryKey,
      artist,
    });
    this.setMemory(memory);
    this.addToSession([trackId]);
  }

  static recordTracks(
    tracks: { id: string; name: string; artists: string[] }[],
    categoryKey: string,
  ): void {
    const memory = this.getMemory();
    tracks.forEach((t) => {
      memory.push({
        trackId: t.id,
        name: t.name,
        timestamp: Date.now(),
        categoryKey,
        artist: t.artists[0] || "Unknown",
      });
    });
    this.setMemory(memory);
    this.addToSession(tracks.map((t) => t.id));
  }

  static isRecentlyShown(trackId: string): boolean {
    if (this.getSessionTracks().has(trackId)) return true;
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return memory.some((entry) => {
      const isExpired = now - entry.timestamp > expiryMs;
      return entry.trackId === trackId && !isExpired;
    });
  }

  static getArtistFatigueScore(artistName: string): number {
    const memory = this.getMemory();
    const now = Date.now();
    const recentWindow = 24 * 60 * 60 * 1000; // 24 hours
    const lowerArtist = artistName.toLowerCase();
    const recentPlays = memory.filter((entry) => {
      const isRecent = now - entry.timestamp < recentWindow;
      return isRecent && entry.artist.toLowerCase() === lowerArtist;
    });
    return recentPlays.length;
  }

  static isArtistFatigued(artistName: string): boolean {
    return this.getArtistFatigueScore(artistName) >= ARTIST_FATIGUE_THRESHOLD;
  }

  static getFatiguedArtists(): string[] {
    const memory = this.getMemory();
    const now = Date.now();
    const recentWindow = 24 * 60 * 60 * 1000;
    const counts = new Map<string, number>();
    for (const entry of memory) {
      if (now - entry.timestamp < recentWindow) {
        const artist = entry.artist.toLowerCase();
        counts.set(artist, (counts.get(artist) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .filter(([, count]) => count >= ARTIST_FATIGUE_THRESHOLD)
      .map(([artist]) => artist);
  }

  static filterOutRecent<T extends { id: string; artists: string[] }>(tracks: T[]): T[] {
    const sessionTracks = this.getSessionTracks();
    const recentIds = new Set(this.getAllRecentTrackIds());
    const fatiguedArtists = new Set(this.getFatiguedArtists());

    return tracks.filter((t) => {
      if (sessionTracks.has(t.id)) return false;
      if (recentIds.has(t.id)) return false;
      const primaryArtist = (t.artists[0] ?? "").toLowerCase();
      if (fatiguedArtists.has(primaryArtist)) return false;
      return true;
    });
  }

  static getRecentTracksInCategory(categoryKey: string): string[] {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return memory
      .filter((entry) => {
        const isExpired = now - entry.timestamp > expiryMs;
        return entry.categoryKey === categoryKey && !isExpired;
      })
      .map((entry) => entry.trackId);
  }

  static getAllRecentTrackIds(): string[] {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return memory
      .filter((entry) => {
        const isExpired = now - entry.timestamp > expiryMs;
        return !isExpired;
      })
      .map((entry) => entry.trackId);
  }

  static getStats() {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const recent = memory.filter((e) => now - e.timestamp <= expiryMs);
    const categories = new Map<string, number>();
    const artists = new Map<string, number>();
    recent.forEach((e) => {
      categories.set(e.categoryKey, (categories.get(e.categoryKey) ?? 0) + 1);
      artists.set(e.artist, (artists.get(e.artist) ?? 0) + 1);
    });

    return {
      totalMemory: memory.length,
      recentTracksInWindow: recent.length,
      categoriesTouched: categories.size,
      categoryCounts: Object.fromEntries(categories),
      uniqueArtists: artists.size,
      topArtists: [...artists.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
      sessionTracks: this.getSessionTracks().size,
      fatiguedArtists: this.getFatiguedArtists(),
    };
  }

  static clearExpiredEntries(): void {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const fresh = memory.filter((e) => now - e.timestamp <= expiryMs);
    this.setMemory(fresh);
  }

  static clear(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      console.warn("Failed to clear music memory");
    }
  }
}

export default MusicMemory;
