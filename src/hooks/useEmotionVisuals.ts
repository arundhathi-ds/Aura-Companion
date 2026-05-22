import { useEffect, useState } from 'react';
import { getMergedTone, subscribeToTone } from '@/core/emotion-state';
import SkillRegistry from '@/core/skill-registry';
import { mapToneToVisuals, VisualState } from '@/core/emotion-visuals';

export function useEmotionVisuals(pollInterval = 1000) {
  const [visuals, setVisuals] = useState<VisualState>(() =>
    mapToneToVisuals(undefined, [])
  );

  useEffect(() => {
    let mounted = true;

    function update() {
      const tone = getMergedTone();
      const skills = SkillRegistry.list().map((m) => m.id);
      const v = mapToneToVisuals(tone, skills as string[]);
      if (!mounted) return;
      setVisuals((prev) => ({ ...prev, ...v }));
    }

    // Subscribe to registry changes for immediate updates
    const unsub = subscribeToTone(() => {
      update();
    });

    // Poll as a fallback so visuals update even if skills change internal state
    const iv = setInterval(update, pollInterval);

    // initial
    update();

    return () => {
      mounted = false;
      unsub();
      clearInterval(iv);
    };
  }, [pollInterval]);

  return visuals;
}

export default useEmotionVisuals;
