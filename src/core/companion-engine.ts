import SkillRegistry, { Skill } from './skill-registry';
import { mergeTones } from './emotion-engine';

// Companion Engine — composes active skills to produce responses and actions.
// This implementation provides a hook pipeline and safe fallbacks so the UI
// can call into skills without risking stability. If no skill responds or an
// error occurs, a caller-provided fallback (usually the legacy server chat)
// will be invoked.

export type CompanionContext = {
  userId?: string;
  mood?: string | null;
  energy?: number | null;
  timeOfDay?: string | null;
  emotionalState?: Record<string, any> | null;
  recentInteractions?: any[];
  activeMissions?: any[];
  memorySummary?: any;
  weatherPlaceholder?: any;
  locationPlaceholder?: any;
};

export type CompanionInput = {
  text: string;
  context?: CompanionContext;
};

// Hook names: beforeRespond, respond, afterRespond, onMoodChange, onMemoryStored, onMissionGenerated

export async function getCompanionResponse(
  input: CompanionInput,
  // fallbackFn should implement the legacy behaviour (e.g. server LLM call)
  fallbackFn?: (input: CompanionInput) => Promise<{ reply: string } | { reply: string; [k: string]: any }>
) {
  const ctx = input.context ?? ({} as CompanionContext);

  // Run beforeRespond hooks (allow skills to short-circuit or enrich context)
  const skills = (SkillRegistry.list() ?? []).map((m) => SkillRegistry.get(m.id)!).filter(Boolean) as Skill[];
  for (const s of skills) {
    try {
      if (s.hooks && typeof s.hooks['beforeRespond'] === 'function') {
        // allow modifications or side-effects
        // Do not let errors bubble up
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await s.hooks['beforeRespond']({ input, context: ctx, skillMeta: s.meta });
      }
    } catch (e) {
      // swallow
    }
  }

  // Collect responses from all active skills' respond hooks
  const responses: Array<{ id: string; text: string; tone?: any }> = [];
  const tones: Array<{ valence?: number; energy?: number } | undefined> = [];

  for (const s of skills) {
    try {
      if (s.emotionalTone) tones.push(s.emotionalTone);
      if (s.hooks && typeof s.hooks['respond'] === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const r = await s.hooks['respond']({ input, context: ctx, skillMeta: s.meta });
        if (r && typeof r === 'string') responses.push({ id: s.meta.id, text: r, tone: s.emotionalTone });
      }
    } catch (e) {
      // swallow skill errors to preserve companion stability
    }
  }

  // Merge emotional tones
  const mergedTone = mergeTones(tones);

  // Compose multi-skill responses: simple merging strategy
  // - Prefer concatenation of non-empty skill responses, ordered by skill registration
  const textParts = responses.map((r) => r.text).filter(Boolean);
  let composed = textParts.join(' ');

  // If nothing from skills, fallback to legacy
  if (!composed || composed.trim().length === 0) {
    if (fallbackFn) {
      try {
        const res = await fallbackFn(input);
        const reply = (res as any).reply ?? (res as any).text ?? '';
        // run afterRespond hooks with fallback result
        for (const s of skills) {
          try {
            if (s.hooks && typeof s.hooks['afterRespond'] === 'function') {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              await s.hooks['afterRespond']({ input, context: ctx, skillMeta: s.meta, reply });
            }
          } catch {}
        }
        return { text: reply, from: 'legacy', tone: mergedTone };
      } catch (e) {
        // fallback failed, return safe default
        return { text: "I'm here. Try again?", from: 'fallback-error', tone: mergedTone };
      }
    }

    return { text: "...", from: 'companion', tone: mergedTone };
  }

  // Allow afterRespond hooks to observe the composed reply
  for (const s of skills) {
    try {
      if (s.hooks && typeof s.hooks['afterRespond'] === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await s.hooks['afterRespond']({ input, context: ctx, skillMeta: s.meta, reply: composed });
      }
    } catch (e) {
      // ignore
    }
  }

  return { text: composed, from: 'skills', tone: mergedTone };
}

export async function triggerByType(type: string, payload?: string) {
  const matches = SkillRegistry.matchTrigger(type, payload);
  const results: any[] = [];
  for (const s of matches) {
    if (s.actions && typeof s.actions['onTrigger'] === 'function') {
      try {
        results.push(await s.actions['onTrigger']({ type, payload }));
      } catch (e) {
        // ignore
      }
    }
  }
  return results;
}

