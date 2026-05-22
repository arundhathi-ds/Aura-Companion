import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAtmosphere } from './AtmosphereProvider';
import { Particles } from '@/components/companion/Particles';

export function AmbientWorld() {
  const { breathing, activity, rareEvent, musicIntensity, current } = useAtmosphere();

  const fogLayers = useMemo(() => {
    return [0, 1, 2].map((i) => ({
      id: i,
      blur: 60 + i * 30,
      opacity: 0.08 + i * 0.05,
      yOffset: (i + 1) * 6 * (1 - activity),
    }));
  }, [activity]);

  const breathScale = 1 + (breathing - 0.5) * 0.06; // subtle
  const speedFactor = 1 + musicIntensity * 0.8;

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Layer 1: far ambient gradient bloom (slow drift & breathe) */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ scale: breathScale, opacity: 0.9 - (activity * 0.12) }}
        transition={{ duration: 8 / Math.max(0.4, speedFactor), ease: 'easeInOut' }}
        className="absolute inset-0"
        style={{ background: 'var(--atmosphere-gradient, linear-gradient(180deg,#071027,#021018))', mixBlendMode: 'screen' }}
      />

      {/* Layer 2: fog / haze */}
      {fogLayers.map((f) => (
        <motion.div key={f.id}
          className="absolute left-0 right-0 top-0 bottom-0"
          style={{
            background: 'radial-gradient(closest-side, color-mix(in oklab,var(--atmosphere-tint, oklch(0.78 0.16 295)) 12%, transparent), transparent 60%)',
            filter: `blur(${f.blur}px)`,
            opacity: f.opacity,
            transform: `translateY(${f.yOffset}px)`,
          }}
          animate={{ x: [0, -8, 0], y: [0, 4, 0] }}
          transition={{ duration: 22 * (1 / Math.max(0.4, speedFactor)), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Layer 3: particles (emotion-weighted) */}
      <div className="absolute inset-0">
        <Particles count={Math.max(12, Math.round(18 * (1 - activity) + 6 * musicIntensity))} />
      </div>

      {/* Layer 4: light streaks & rare cinematic events */}
      <div className="absolute inset-0">
        {rareEvent?.type === 'shooting-star' && (
          <motion.div className="absolute h-0.5 w-56 rounded-full bg-white/60 blur-[6px]"
            style={{ top: `${10 + Math.random() * 60}%`, left: '-20%' }}
            initial={{ x: '-20%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        )}

        {rareEvent?.type === 'light-streak' && (
          <motion.div className="absolute h-1 w-80 rounded-full bg-aurora/40 blur-[10px]"
            style={{ top: `${20 + Math.random() * 50}%`, left: '-40%' }}
            initial={{ x: '-40%', opacity: 0 }}
            animate={{ x: '130%', opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.6, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Layer 5: subtle foreground glow that breathes */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}
        animate={{ opacity: 0.06 + (breathing - 0.5) * 0.06 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default AmbientWorld;
