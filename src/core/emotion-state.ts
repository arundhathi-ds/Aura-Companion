import SkillRegistry from './skill-registry';
import { mergeTones } from './emotion-engine';

export type MergedTone = { valence?: number; energy?: number };

export function getMergedTone(): MergedTone {
  const skills = SkillRegistry.list().map((m) => SkillRegistry.get(m.id)).filter(Boolean) as any[];
  const tones = skills.map((s) => s.emotionalTone).filter(Boolean);
  return mergeTones(tones);
}

export function subscribeToTone(cb: () => void) {
  return SkillRegistry.onChange(cb);
}
