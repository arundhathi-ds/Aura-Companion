import { EXPERIENCES, type Experience, type TimeOfDay } from "@/data/experiences";

export type EngineContext = {
  mood?: string | null;
  focusAreas?: string[] | null;
  intentions?: string[] | null;
  /** 0 introvert -> 2 extrovert */
  socialComfort?: 0 | 1 | 2;
  /** 1 (low) -> 5 (high) — how much energy the person currently has */
  energy?: 1 | 2 | 3 | 4 | 5;
  now?: Date;
  excludeSlugs?: string[];
  /** slugs of experiences the user has saved — gently boost similar vibes */
  savedSlugs?: string[];
  /** slugs the user has completed — soft cooldown so they don't repeat too soon */
  completedSlugs?: string[];
  /** recent moods (most recent first) — adapt to emotional trajectory */
  recentMoods?: string[];
};

export function timeOfDay(d = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h < 11) return "morning";
  if (h < 16) return "afternoon";
  if (h < 19) return "golden_hour";
  if (h < 22) return "evening";
  return "night";
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function scoreExperience(exp: Experience, ctx: EngineContext): number {
  let score = 0;
  const mood = (ctx.mood ?? "").toLowerCase();
  const tod = timeOfDay(ctx.now);
  const social = ctx.socialComfort ?? 1;
  const energy = ctx.energy ?? 3;

  if (mood && exp.moods.includes(mood)) score += 5;
  if (exp.bestTimes.includes(tod)) score += 3;

  // social fit (penalize mismatch)
  score -= Math.abs(exp.social - social) * 1.5;

  // energy fit — closer is better, big mismatch hurts
  score -= clamp(Math.abs(exp.energy - energy) - 1, 0, 4) * 1.2;

  // focus area overlap
  const focus = (ctx.focusAreas ?? []).map((f) => f.toLowerCase());
  const overlap = exp.focusAreas.filter((f) => focus.includes(f.toLowerCase())).length;
  score += overlap * 1.5;

  // recent mood trajectory — count tag matches across recent moods
  if (ctx.recentMoods?.length) {
    const matches = ctx.recentMoods
      .slice(0, 5)
      .filter((m) => exp.moods.includes((m ?? "").toLowerCase())).length;
    score += matches * 0.6;
  }

  // soft taste boost from saved history (same category nudges up)
  if (ctx.savedSlugs?.length) {
    const savedCats = new Set(
      EXPERIENCES.filter((e) => ctx.savedSlugs!.includes(e.slug)).map((e) => e.category)
    );
    if (savedCats.has(exp.category)) score += 1.2;
  }

  // cooldown for things the user already completed recently
  if (ctx.completedSlugs?.includes(exp.slug)) score -= 4;

  // gentle randomness so today's pick isn't always identical
  score += Math.random() * 0.8;

  return score;
}

export function recommendExperiences(ctx: EngineContext, limit = 8): Experience[] {
  const exclude = new Set(ctx.excludeSlugs ?? []);
  return EXPERIENCES
    .filter((e) => !exclude.has(e.slug))
    .map((e) => ({ exp: e, score: scoreExperience(e, ctx) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ exp }) => exp);
}

/** Deterministic "today's experience" — stable for ~24h per user-mood combo. */
export function pickTodaysExperience(ctx: EngineContext): Experience {
  const ranked = recommendExperiences(ctx, 5);
  // Seed by date so it doesn't change throughout the day for the same user state
  const day = new Date(ctx.now ?? new Date()).toISOString().slice(0, 10);
  const seedStr = `${day}|${ctx.mood ?? ""}|${(ctx.focusAreas ?? []).join(",")}`;
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  return ranked[h % ranked.length] ?? EXPERIENCES[0];
}

/** Map a mood to an "emotional weather" label + tint. */
export function emotionalWeather(mood?: string | null): { label: string; tint: string } {
  const m = (mood ?? "").toLowerCase();
  switch (m) {
    case "calm":     return { label: "Calm Evening",        tint: "oklch(0.82 0.15 200)" };
    case "curious":  return { label: "Quiet Curiosity",     tint: "oklch(0.85 0.18 320)" };
    case "heavy":    return { label: "Emotional Fog",       tint: "oklch(0.6 0.05 280)" };
    case "hopeful":  return { label: "Soft Motivation",     tint: "oklch(0.82 0.18 50)" };
    case "restless": return { label: "Restless Creativity", tint: "oklch(0.78 0.16 295)" };
    case "tender":   return { label: "Tender Solitude",     tint: "oklch(0.85 0.18 320)" };
    default:         return { label: "Creative Spark",      tint: "oklch(0.85 0.18 320)" };
  }
}
