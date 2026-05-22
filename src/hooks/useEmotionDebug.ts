import { useEffect, useMemo, useState } from 'react';
import { getMergedTone, subscribeToTone } from '@/core/emotion-state';
import SkillRegistry from '@/core/skill-registry';
import { mapToneToVisuals, VisualState } from '@/core/emotion-visuals';

export type EmotionalDebugState = {
  calmness: number;
  empathy: number;
  curiosity: number;
  poetic: number;
  intensity: number;
  energy: number;
  quietMode: boolean;
  activeSkills: string[];
  visualState: VisualState;
  enabled: boolean;
};

const DEBUG_KEY = 'aura_debug_emotion';

function getDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const localValue = window.localStorage.getItem(DEBUG_KEY);
  if (localValue === 'true') return true;
  if (window.location.search.includes('debug-emotion')) return true;
  return false;
}

export function toggleDebugMode(enabled?: boolean) {
  if (typeof window === 'undefined') return;
  const next = typeof enabled === 'boolean' ? enabled : !getDebugEnabled();
  window.localStorage.setItem(DEBUG_KEY, next ? 'true' : 'false');
  window.dispatchEvent(new Event('aura_debug_emotion_change'));
}

export function useEmotionDebug(pollInterval = 1200) {
  const [enabled, setEnabled] = useState(() => getDebugEnabled());
  const [state, setState] = useState<EmotionalDebugState>(() => {
    const tone = undefined;
    const visualState = mapToneToVisuals(undefined, []);
    return {
      calmness: 0.5,
      empathy: 0.5,
      curiosity: 0.5,
      poetic: 0,
      intensity: 0,
      energy: 0.3,
      quietMode: false,
      activeSkills: [],
      visualState,
      enabled,
    };
  });

  useEffect(() => {
    let mounted = true;

    function computeState() {
      const tone = getMergedTone();
      const activeSkills = SkillRegistry.list().map((skill) => skill.id);
      const visualState = mapToneToVisuals(tone, activeSkills);

      const energy = Math.min(1, Math.max(0, tone.energy ?? 0.3));
      const valence = Math.min(1, Math.max(-1, tone.valence ?? 0));
      const calmness = 1 - energy;
      const poetic = activeSkills.includes('storyteller') || activeSkills.includes('poet') ? 1 : 0;
      const curiosity = activeSkills.includes('exploration-engine') ? 1 : 0;
      const empathy = Math.max(0, Math.min(1, 0.45 + valence * 0.3));
      const intensity = Math.max(0, Math.min(1, Math.abs(valence) * energy));
      const quietMode = activeSkills.includes('quiet-mode') || activeSkills.includes('whisper-mode');

      if (!mounted) return;
      setState({
        calmness,
        empathy,
        curiosity,
        poetic,
        intensity,
        energy,
        quietMode,
        activeSkills,
        visualState,
        enabled: getDebugEnabled(),
      });
    }

    function handleDebugToggle() {
      if (!mounted) return;
      setEnabled(getDebugEnabled());
    }

    const unsub = subscribeToTone(() => {
      computeState();
    });
    const storageListener = () => handleDebugToggle();
    window.addEventListener('aura_debug_emotion_change', storageListener);
    const interval = window.setInterval(computeState, pollInterval);
    computeState();

    const keyListener = (event: KeyboardEvent) => {
      const isDebugKey = event.ctrlKey && event.altKey && event.key.toLowerCase() === 'e';
      if (isDebugKey) {
        event.preventDefault();
        toggleDebugMode();
      }
    };
    window.addEventListener('keydown', keyListener);

    return () => {
      mounted = false;
      unsub();
      window.removeEventListener('aura_debug_emotion_change', storageListener);
      window.removeEventListener('keydown', keyListener);
      window.clearInterval(interval);
    };
  }, [pollInterval]);

  return state;
}
