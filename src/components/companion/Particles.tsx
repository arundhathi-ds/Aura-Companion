import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAtmosphere } from "@/components/atmosphere/AtmosphereProvider";

const DEFAULT_HUES = [
  "oklch(0.85 0.18 320 / 0.55)",
  "oklch(0.78 0.16 295 / 0.55)",
  "oklch(0.82 0.15 200 / 0.55)",
  "oklch(0.82 0.18 50 / 0.45)",
];

export function Particles({ count = 28 }: { count?: number }) {
  const { current } = useAtmosphere();
  const hues = useMemo(() => {
    if (!current?.visual?.tint) return DEFAULT_HUES;
    // produce palette mixing tint with defaults
    return [current.visual.tint, DEFAULT_HUES[2], DEFAULT_HUES[3]];
  }, [current]);

  const speedFactor = current ? (current.key === 'hyper-mode' ? 0.5 : current.key === 'rainy-window' ? 1.6 : 1) : 1;

  const [items, setItems] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 50,
      y: 50,
      size: 2,
      duration: 8,
      delay: 0,
      color: DEFAULT_HUES[i % DEFAULT_HUES.length],
    }))
  );

  useEffect(() => {
    setItems(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + (current?.key === 'deep-focus' ? 1 : 2),
        duration: (6 + Math.random() * 12) * speedFactor,
        delay: Math.random() * 6,
        color: hues[Math.floor(Math.random() * hues.length)],
      }))
    );
  }, [count, hues, speedFactor, current]);

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
            filter: current?.key === 'dreamy' ? 'blur(6px)' : 'blur(2px)',
            boxShadow: `0 0 ${current?.key === 'neon-city' ? 22 : 12}px ${p.color}`,
            opacity: current?.key === 'rainy-window' ? 0.9 : 0.85,
          }}
          animate={current?.key === 'neon-city' ? { y: [0, -24, 0], x: [0, 6, 0], opacity: [0.2, 0.95, 0.2] } : { y: [0, -50, 0], x: [0, 14, 0], opacity: [0.15, 0.95, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
