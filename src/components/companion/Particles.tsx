import { useMemo } from "react";
import { motion } from "framer-motion";

const HUES = [
  "oklch(0.85 0.18 320 / 0.55)", // primary glow pink
  "oklch(0.78 0.16 295 / 0.55)", // primary violet
  "oklch(0.82 0.15 200 / 0.55)", // aurora cyan
  "oklch(0.82 0.18 50 / 0.45)",  // ember peach
];

export function Particles({ count = 28 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        duration: 8 + Math.random() * 14,
        delay: Math.random() * 6,
        color: HUES[Math.floor(Math.random() * HUES.length)],
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.color,
            filter: "blur(2px)",
            boxShadow: `0 0 12px ${p.color}`,
          }}
          animate={{ y: [0, -50, 0], x: [0, 14, 0], opacity: [0.15, 0.95, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
