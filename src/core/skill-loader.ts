import SkillRegistry, { Skill } from './skill-registry';

// Skill loader - attempts to auto-discover and register skills.
// Implementation is Vite-friendly (uses import.meta.glob) and falls
// back to no-op in environments where that isn't available.

export async function loadAllSkills() {
  // Vite provides import.meta.glob; we keep this optional so runtime doesn't fail.
  // The glob pattern targets folders under /src/skills/*/index.ts
  // When building, Vite will inline the matches.
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.glob) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Vite's glob feature
      const modules = import.meta.glob('/src/skills/*/index.ts', { eager: true }) as Record<string, { default: Skill } | Skill>;
      for (const path in modules) {
        const mod = (modules[path] as any).default ?? modules[path];
        if (mod && mod.meta) {
          SkillRegistry.register(mod as Skill);
        }
      }
    }
  } catch (e) {
    // Non-Vite or serverless environments can implement their own loader.
    // For now, just log and continue without failing the app.
    // console.debug('Skill loader: import.meta.glob not available', e);
  }
}

export async function loadSkillModule(module: Promise<any>) {
  const mod = await module;
  const skill = mod?.default ?? mod;
  if (skill && skill.meta) SkillRegistry.register(skill as Skill);
  return skill as Skill | undefined;
}
