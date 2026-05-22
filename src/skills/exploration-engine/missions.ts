export type Mission = { id: string; title: string; hook: string; action: string };

export function generateMission(vibe: string): Mission {
  // Placeholder simple mission generator
  return {
    id: Math.random().toString(36).slice(2),
    title: `${vibe} side quest`,
    hook: `Tonight feels ${vibe}.`,
    action: 'Take a photo of something that caught your eye.',
  };
}

export default { generateMission };
