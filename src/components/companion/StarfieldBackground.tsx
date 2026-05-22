import { useEffect, useState } from "react";

type Star = { top: number; left: number; size: number; delay: number; duration: number };

const generateStars = (): Star[] =>
  Array.from({ length: 60 }).map(() => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
  }));

export function StarfieldBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars());
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: 'var(--atmosphere-gradient, linear-gradient(180deg,#0b1220,#042233))' }} />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-[140px]"
        style={{ background: 'color-mix(in oklab, var(--atmosphere-tint, oklch(0.82 0.15 200)) 20%, transparent)' }} />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: 'color-mix(in oklab, var(--atmosphere-tint, oklch(0.75 0.2 140)) 14%, transparent)' }} />
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
