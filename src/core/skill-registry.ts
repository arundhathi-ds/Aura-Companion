// Central Skill Registry for Aura Companion
// - Defines the Skill interface
// - Provides a runtime registry to register/unregister and query skills

export type SkillTrigger = { type: string; pattern?: string };

export type SkillMeta = {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;
};

export type Skill = {
  meta: SkillMeta;
  triggers?: SkillTrigger[];
  personality?: Record<string, unknown>;
  emotionalTone?: { valence?: number; energy?: number };
  // actions are functions the skill exposes to be called by the companion engine
  actions?: Record<string, (...args: any[]) => Promise<any> | any>;
  // hooks the skill can expose for recommendations, missions etc.
  hooks?: Record<string, (...args: any[]) => Promise<any> | any>;
  // optional initialization
  init?: () => Promise<void> | void;
  // optional teardown
  dispose?: () => Promise<void> | void;
};

class SkillRegistryClass {
  private skills: Map<string, Skill> = new Map();
  private active: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();

  register(skill: Skill) {
    if (this.skills.has(skill.meta.id)) return;
    this.skills.set(skill.meta.id, skill);
    this.active.add(skill.meta.id);
    if (skill.init) skill.init();
    this.emitChange();
  }

  unregister(id: string) {
    const s = this.skills.get(id);
    if (!s) return;
    if (s.dispose) s.dispose();
    this.skills.delete(id);
    this.active.delete(id);
    this.emitChange();
  }

  list(): SkillMeta[] {
    return Array.from(this.skills.values()).map((s) => s.meta);
  }

  get(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  isActive(id: string) {
    return this.active.has(id);
  }

  activate(id: string) {
    if (this.skills.has(id)) this.active.add(id);
    this.emitChange();
  }

  deactivate(id: string) {
    this.active.delete(id);
    this.emitChange();
  }

  onChange(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emitChange() {
    for (const cb of this.listeners) {
      try { cb(); } catch {}
    }
  }

  // query triggers (simple first-match)
  matchTrigger(type: string, payload?: string) {
    const matches: Skill[] = [];
    for (const s of this.skills.values()) {
      if (!s.triggers) continue;
      for (const t of s.triggers) {
        if (t.type === type) {
          if (!t.pattern || (payload && payload.includes(t.pattern))) {
            matches.push(s);
            break;
          }
        }
      }
    }
    return matches;
  }
}

export const SkillRegistry = new SkillRegistryClass();

export default SkillRegistry;
