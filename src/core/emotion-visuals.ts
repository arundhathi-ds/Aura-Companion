export type VisualState = {
  glow: number; // 0..1
  pulse: number; // speed multiplier
  blur: number; // px multiplier
  aura: number; // spread multiplier
  float: number; // float/rotation speed multiplier
  hue: number; // 0..360 color hue shift
  opacity: number; // 0..1
};

export function mapToneToVisuals(
  tone: { valence?: number; energy?: number } | undefined,
  activeSkillIds: string[] = []
): VisualState {
  // Defaults
  const valence = (tone && typeof tone.valence === 'number' ? tone.valence : 0) as number;
  const energy = (tone && typeof tone.energy === 'number' ? tone.energy : 0.3) as number;

  // Derive emotional axes
  const calmness = 1 - Math.min(Math.max(energy, 0), 1); // high energy -> low calm
  const intensity = Math.abs(valence) * Math.min(Math.max(energy, 0), 1);

  // Skill flags
  const poetic = activeSkillIds.includes('storyteller') || activeSkillIds.includes('poet');
  const whisper = activeSkillIds.includes('whisper-mode') || activeSkillIds.includes('quiet-mode');
  const curious = activeSkillIds.includes('exploration-engine');

  // Map to visuals (bounded)
  const glow = Math.min(1, 0.25 + intensity * 1.25 + (poetic ? 0.12 : 0));
  const pulse = Math.max(0.6, 1 + energy * 1.2); // multiplier of base speed
  const blur = Math.min(1.5, 0.6 + (poetic ? 0.6 : 0) + (whisper ? -0.2 : 0));
  const aura = Math.min(1.8, 0.6 + intensity * 1.4);
  const floatSpeed = Math.max(0.6, 1 + (curious ? 0.25 : 0) + energy * 0.5);
  const hue = 275 + valence * 30; // around purple/blue shifting warmer with positive valence
  const opacity = whisper ? 0.85 : Math.min(1, 0.7 + intensity * 0.4 + energy * 0.15);

  // Apply calmness dampening
  const calmFactor = 0.5 + calmness * 0.5;

  return {
    glow: Math.max(0, Math.min(1, glow * calmFactor)),
    pulse: pulse * calmFactor,
    blur: Math.max(0.2, blur * calmFactor),
    aura: aura * calmFactor,
    float: floatSpeed * calmFactor,
    hue: Math.max(0, Math.min(360, hue)),
    opacity: Math.max(0.4, Math.min(1, opacity)),
  };
}
