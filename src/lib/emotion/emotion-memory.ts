type MemoryEvent = {
  category: string | null;
  timestamp: number; // ms
  musicIntensity?: number;
};

const STORAGE_KEY = 'aura_emotion_memory_v1';
const MAX_EVENTS = 800;

function load(): MemoryEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MemoryEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function save(events: MemoryEvent[]) {
  try {
    const arr = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // noop
  }
}

export function recordAtmosphereEvent(category: string | null, musicIntensity?: number) {
  const events = load();
  events.push({ category, timestamp: Date.now(), musicIntensity });
  save(events);
}

export function clearMemory() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function getMemoryEvents() {
  return load();
}

function recentWindowMs(days = 30) {
  return days * 24 * 60 * 60 * 1000;
}

export function getPreferredCategories(days = 30) {
  const cutoff = Date.now() - recentWindowMs(days);
  const events = load().filter((e) => e.timestamp >= cutoff && e.category);
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.category as string] = (counts[e.category as string] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map((r) => ({ category: r[0], count: r[1] }));
}

export function getUsageByHour(days = 30) {
  const cutoff = Date.now() - recentWindowMs(days);
  const events = load().filter((e) => e.timestamp >= cutoff);
  const hours = new Array(24).fill(0);
  for (const e of events) {
    const h = new Date(e.timestamp).getHours();
    hours[h]++;
  }
  return hours;
}

export function getAverageMusicIntensity(days = 30) {
  const cutoff = Date.now() - recentWindowMs(days);
  const events = load().filter((e) => e.timestamp >= cutoff && typeof e.musicIntensity === 'number');
  if (events.length === 0) return 0;
  const sum = events.reduce((s, e) => s + (e.musicIntensity ?? 0), 0);
  return sum / events.length;
}

export function getMemorySummary() {
  const prefs = getPreferredCategories(90);
  const hours = getUsageByHour(90);
  const avgIntensity = getAverageMusicIntensity(90);
  return { preferences: prefs.slice(0, 6), hours, avgIntensity };
}

export default { recordAtmosphereEvent, getMemoryEvents, getPreferredCategories, getMemorySummary, clearMemory };
