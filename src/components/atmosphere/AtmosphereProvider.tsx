import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { findCategoryByKey, type CategoryProfile } from '@/lib/spotify/categories';
import { recordAtmosphereEvent, getMemorySummary } from '@/lib/emotion/emotion-memory';

type RareEvent = { type: string; startedAt: number } | null;

type AtmosphereContextType = {
  current?: CategoryProfile | null;
  setAtmosphere: (key: string | null) => void;
  breathing: number; // 0..1 subtle breath
  activity: number; // 0..1 recent user activity
  musicIntensity: number; // 0..1, external hook can set
  rareEvent: RareEvent;
  markInteraction: () => void;
  setMusicIntensity: (v: number) => void;
};

const AtmosphereContext = createContext<AtmosphereContextType>({
  setAtmosphere: () => {}, breathing: 0.5, activity: 1, musicIntensity: 0.3, rareEvent: null, markInteraction: () => {}, setMusicIntensity: () => {},
});

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const current = useMemo(() => (currentKey ? findCategoryByKey(currentKey) : null), [currentKey]);

  const [breathing, setBreathing] = useState(0.5);
  const [activity, setActivity] = useState(1);
  const [musicIntensity, _setMusicIntensity] = useState(0.2);
  const [rareEvent, setRareEvent] = useState<RareEvent>(null);

  const lastInteractionRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  const markInteraction = () => {
    lastInteractionRef.current = Date.now();
    setActivity(1);
  };

  const setMusicIntensity = (v: number) => {
    _setMusicIntensity(Math.max(0, Math.min(1, v)));
  };

  // user interaction listeners (mouse/keyboard/touch)
  useEffect(() => {
    const onInteract = () => markInteraction();
    window.addEventListener('mousemove', onInteract);
    window.addEventListener('keydown', onInteract);
    window.addEventListener('touchstart', onInteract);
    return () => {
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, []);

  // time-based evolution loop
  useEffect(() => {
    let start = performance.now();
    let lastRareCheck = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000; // seconds

      // decay activity if no interaction in last N seconds
      const idleMs = Date.now() - lastInteractionRef.current;
      const idleFactor = Math.max(0, Math.min(1, 1 - idleMs / (1000 * 60 * 6))); // decays to 0 over 6 minutes
      setActivity(idleFactor);

      // breathing: base oscillation frequency depends on musicIntensity and activity
      const baseFreq = 0.04 + musicIntensity * 0.12 + (activity * 0.02);
      const amp = 0.04 + (currentKey === 'hyper-mode' ? 0.06 : currentKey === 'deep-focus' ? 0.02 : 0.035);
      const value = 0.5 + Math.sin(t * Math.PI * 2 * baseFreq) * amp;
      setBreathing(value);
      // set CSS vars for components to consume (breathe/activity/intensity)
      const root = document.documentElement;
      root.style.setProperty('--atmosphere-breath', String(value));
      root.style.setProperty('--atmosphere-activity', String(idleFactor));
      root.style.setProperty('--atmosphere-music', String(musicIntensity));

      // occasional rare cinematic events: check every 10s
      if (now - lastRareCheck > 10000) {
        lastRareCheck = now;
        const roll = Math.random();
        // less likely during high activity
        const threshold = 0.03 + (musicIntensity * 0.02) + (1 - idleFactor) * 0.02;
        if (roll < threshold) {
          // pick an event
          const events = ['shooting-star', 'light-streak', 'soft-flash', 'neon-flicker', 'ripple'];
          const e = events[Math.floor(Math.random() * events.length)];
          setRareEvent({ type: e, startedAt: Date.now() });
          // clear after a moment
          setTimeout(() => setRareEvent(null), 2200 + Math.random() * 1800);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [currentKey, musicIntensity]);

  // apply CSS variables for gradients and tints (when atmosphere changes)
  useEffect(() => {
    const root = document.documentElement;
    if (current?.visual?.gradient) root.style.setProperty('--atmosphere-gradient', current.visual.gradient);
    if (current?.visual?.tint) root.style.setProperty('--atmosphere-tint', current.visual.tint);
    if (!current) {
      root.style.removeProperty('--atmosphere-gradient');
      root.style.removeProperty('--atmosphere-tint');
    }
    // dataset to allow CSS selectors
    if (current?.key) document.body.dataset.atmosphere = current.key; else delete document.body.dataset.atmosphere;
  }, [current]);

  // wrap setAtmosphere so we record selections into memory
  const setAtmosphereWrapped = (k: string | null) => {
    setCurrentKey(k);
    try { recordAtmosphereEvent(k, musicIntensity); } catch {}
  };

  // memory-influenced modifiers
  useEffect(() => {
    try {
      const summary = getMemorySummary();
      // subtle influence: if a preferred category appears often at night, bias rare events and breathing
      if (summary.preferences && summary.preferences.length) {
        const top = summary.preferences[0];
        // example: if top category count is high, slightly increase chance of memory callbacks
        // we set a CSS var for tuning UI components
        document.documentElement.style.setProperty('--aura-pref-top', String(top.count));
      }
      document.documentElement.style.setProperty('--aura-pref-avg-intensity', String(summary.avgIntensity ?? 0));
    } catch {}
  }, [/* run on mount and when needed */]);

  const value = useMemo(() => ({ current, setAtmosphere: setAtmosphereWrapped, breathing, activity, musicIntensity, rareEvent, markInteraction, setMusicIntensity }), [current, breathing, activity, musicIntensity, rareEvent]);
  return <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>;
}

export function useAtmosphere() {
  return useContext(AtmosphereContext);
}

export default AtmosphereProvider;
