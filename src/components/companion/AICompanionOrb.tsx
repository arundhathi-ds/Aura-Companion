import { motion } from "framer-motion";

export function AICompanionOrb({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.78 0.16 295 / 0.4), oklch(0.82 0.15 200 / 0.4), oklch(0.85 0.18 320 / 0.4), oklch(0.78 0.16 295 / 0.4))",
          filter: "blur(30px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-6 rounded-full bg-orb animate-pulse-glow" />
      <motion.div
        className="absolute inset-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(1 0 0 / 0.9), oklch(0.85 0.18 320 / 0.6) 35%, oklch(0.55 0.2 280 / 0.4) 70%, transparent)",
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
