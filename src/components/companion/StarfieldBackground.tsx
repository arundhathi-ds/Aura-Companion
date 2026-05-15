import { useMemo } from "react";

export function StarfieldBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-aurora/15 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary-glow/15 blur-[120px]" />
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
