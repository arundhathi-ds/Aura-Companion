/**
 * Music Memory System
 * Tracks recently recommended/played tracks to ensure freshness and variety.
 * Prevents repetition and enables intelligent recommendation rotation.
 */

export interface MusicMemoryEntry {
  trackId: string;
  name: string;
  timestamp: number;
  categoryKey: string;
  artist: string;
}

const STORAGE_KEY = 'aura_music_memory';
const MAX_MEMORY = 500; // Keep last 500 tracks
const EXPIRY_DAYS = 7; // Tracks older than 7 days are forgotten

export class MusicMemory {
  private static getMemory(): MusicMemoryEntry[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static setMemory(entries: MusicMemoryEntry[]): void {
    try {
      if (typeof window === 'undefined') return;
      const trimmed = entries.slice(-MAX_MEMORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      console.warn('Failed to save music memory');
    }
  }

  /**
   * Record a track that was shown to the user
   */
  static recordTrack(
    trackId: string,
    name: string,
    categoryKey: string,
    artist: string
  ): void {
    const memory = this.getMemory();
    memory.push({
      trackId,
      name,
      timestamp: Date.now(),
      categoryKey,
      artist,
    });
    this.setMemory(memory);
  }

  /**
   * Record multiple tracks at once (after recommendations)
   */
  static recordTracks(
    tracks: { id: string; name: string; artists: string[] }[],
    categoryKey: string
  ): void {
    const memory = this.getMemory();
    tracks.forEach((t) => {
      memory.push({
        trackId: t.id,
        name: t.name,
        timestamp: Date.now(),
        categoryKey,
        artist: t.artists[0] || 'Unknown',
      });
    });
    this.setMemory(memory);
  }

  /**
   * Check if a track was recently shown (within expiry window)
   */
  static isRecentlyShown(trackId: string): boolean {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    return memory.some((entry) => {
      const isExpired = now - entry.timestamp > expiryMs;
      return entry.trackId === trackId && !isExpired;
    });
  }

  /**
   * Get tracks that were shown in a specific category recently
   */
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

  /**
   * Get all recent track IDs (across all categories)
   */
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

  /**
   * Get memory stats for debugging
   */
  static getStats() {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    const recent = memory.filter((e) => now - e.timestamp <= expiryMs);
    const categories = new Map<string, number>();
    recent.forEach((e) => {
      categories.set(e.categoryKey, (categories.get(e.categoryKey) ?? 0) + 1);
    });

    return {
      totalMemory: memory.length,
      recentTracksInWindow: recent.length,
      categoriesTouched: categories.size,
      categoryCounts: Object.fromEntries(categories),
    };
  }

  /**
   * Clear old entries (older than expiry window)
   */
  static clearExpiredEntries(): void {
    const memory = this.getMemory();
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    const fresh = memory.filter((e) => now - e.timestamp <= expiryMs);
    this.setMemory(fresh);
  }

  /**
   * Clear all memory (nuclear option)
   */
  static clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      console.warn('Failed to clear music memory');
    }
  }
}

export default MusicMemory;
