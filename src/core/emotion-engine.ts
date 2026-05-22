// Simple emotion engine that merges emotional tones from active skills

export function mergeTones(tones: Array<{ valence?: number; energy?: number } | undefined>) {
  const aggregate = { valence: 0, energy: 0 };
  let count = 0;
  for (const t of tones) {
    if (!t) continue;
    if (typeof t.valence === 'number') aggregate.valence += t.valence;
    if (typeof t.energy === 'number') aggregate.energy += t.energy;
    count++;
  }
  if (count === 0) return aggregate;
  return { valence: aggregate.valence / count, energy: aggregate.energy / count };
}
