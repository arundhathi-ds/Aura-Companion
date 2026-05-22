import { AnimatePresence, motion } from 'framer-motion';
import { useEmotionDebug } from '@/hooks/useEmotionDebug';

export function EmotionDebugOverlay() {
  const debug = useEmotionDebug();

  if (!debug.enabled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        className="pointer-events-none fixed bottom-4 left-4 z-[60] w-[250px] rounded-2xl border border-white/15 bg-slate-950/85 px-3 py-3 text-[11px] text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-semibold uppercase tracking-[0.24em] text-slate-300">Emotion Debug</span>
          <span className="rounded-full bg-slate-800/85 px-2 py-0.5 text-[10px] text-emerald-300">
            dev
          </span>
        </div>

        <div className="grid gap-1 text-slate-200">
          <DebugRow label="Calmness" value={debug.calmness} />
          <DebugRow label="Empathy" value={debug.empathy} />
          <DebugRow label="Curiosity" value={debug.curiosity} />
          <DebugRow label="Poetic" value={debug.poetic} />
          <DebugRow label="Intensity" value={debug.intensity} />
          <DebugRow label="Energy" value={debug.energy} />
          <DebugRow label="Quiet Mode" value={debug.quietMode ? 1 : 0} short />
        </div>

        <div className="mt-3 rounded-2xl bg-slate-900/85 px-2 py-2 text-[10px] text-slate-300">
          <div className="mb-2 font-semibold text-slate-200">Visual mapping</div>
          <DebugLabelPair label="Glow" value={debug.visualState.glow?.toFixed(2)} />
          <DebugLabelPair label="Hue" value={debug.visualState.hue?.toFixed(1)} />
          <DebugLabelPair label="Pulse" value={debug.visualState.pulse?.toFixed(2)} />
          <DebugLabelPair label="Blur" value={debug.visualState.blur?.toFixed(2)} />
        </div>

        <div className="mt-3 rounded-2xl bg-slate-900/85 px-2 py-2 text-[10px] text-slate-300">
          <div className="mb-1 font-semibold text-slate-200">Active skills</div>
          <div className="flex flex-wrap gap-1">
            {debug.activeSkills.length ? (
              debug.activeSkills.map((id) => (
                <span key={id} className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-200">
                  {id}
                </span>
              ))
            ) : (
              <span className="text-slate-500">none</span>
            )}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-slate-500">
          Press <span className="font-semibold text-slate-200">Ctrl + Alt + E</span> to toggle.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function DebugRow({ label, value, short }: { label: string; value: number; short?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-100">{short ? (value ? 'on' : 'off') : value.toFixed(2)}</span>
    </div>
  );
}

function DebugLabelPair({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-center justify-between gap-2 text-slate-400">
      <span>{label}</span>
      <span className="font-mono text-slate-200">{value ?? 'n/a'}</span>
    </div>
  );
}
