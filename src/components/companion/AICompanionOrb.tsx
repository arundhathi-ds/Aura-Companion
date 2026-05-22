import { motion } from "framer-motion";
import useEmotionVisuals from "@/hooks/useEmotionVisuals";

export function AICompanionOrb({ size = 220 }: { size?: number }) {
  const visuals = useEmotionVisuals(800);

  // Map visuals to concrete style values
  const outerBlur = Math.max(12, 30 * visuals.aura);
  const innerBlur = Math.max(4, 12 * visuals.blur);
  const rotateDuration = Math.max(8, 22 / visuals.float);
  const breatheDuration = Math.max(3, 5 / visuals.pulse);
  const highlightBlur = Math.max(3, 6 * (visuals.blur * 0.6));
  const hue = Math.round(visuals.hue);
  const orbOpacity = visuals.opacity;

  const conicBackground = `conic-gradient(from 0deg, hsl(${hue} 60% 60% / ${Math.min(0.5, visuals.glow)}), hsl(${(hue + 60) % 360} 50% 45% / ${Math.min(0.45, visuals.glow)}), hsl(${(hue + 120) % 360} 45% 50% / ${Math.min(0.35, visuals.glow)}), hsl(${hue} 60% 60% / ${Math.min(0.5, visuals.glow)}))`;

  const radialBg = `radial-gradient(circle at 35% 30%, rgba(255,255,255,${0.9 * visuals.glow}), hsl(${hue} 60% 60% / ${0.6 * visuals.glow}) 35%, hsl(${(hue + 60) % 360} 45% 50% / ${0.4 * visuals.glow}) 70%, transparent)`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: conicBackground,
          filter: `blur(${outerBlur}px)`,
          opacity: orbOpacity,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: rotateDuration, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-6 rounded-full"
        style={{
          background: 'var(--orb, radial-gradient(circle at 50% 40%, rgba(255,255,255,0.04), transparent 40%))',
          filter: `blur(${innerBlur}px)`,
          opacity: orbOpacity,
          boxShadow: `0 0 ${20 * visuals.glow}px rgba(0,0,0,${0.25 * visuals.glow})`,
        }}
      />
      <motion.div
        className="absolute inset-10 rounded-full"
        style={{
          background: radialBg,
        }}
        animate={{ scale: [1, 1 + 0.03 * visuals.pulse, 1] }}
        transition={{ duration: breatheDuration, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* highlight */}
      <div
        className="absolute rounded-full opacity-80 mix-blend-screen"
        style={{
          width: size * 0.18,
          height: size * 0.18,
          top: size * 0.22,
          left: size * 0.28,
          background: "radial-gradient(circle, white, transparent 70%)",
          filter: `blur(${highlightBlur}px)`,
          opacity: 0.9 * orbOpacity,
        }}
      />
    </div>
  );
}
