/**
 * use-voice-output.ts
 * Wraps the browser's SpeechSynthesis API to let the Orb speak replies aloud.
 *
 * Gracefully degrades when the browser doesn't support the API.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceOutputState = {
  /** True while text is being spoken */
  speaking: boolean;
  /** True if the browser supports SpeechSynthesis */
  supported: boolean;
  /** Speak the given text */
  speak: (text: string) => void;
  /** Cancel current speech immediately */
  stop: () => void;
};

/** Pick the softest, most natural-sounding voice available. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === "undefined") return null;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Preference order: female en-GB → female en-US → any en → fallback
  const preferred = [
    voices.find((v) => /female|samantha|karen|moira/i.test(v.name) && v.lang.startsWith("en")),
    voices.find((v) => v.lang === "en-GB"),
    voices.find((v) => v.lang === "en-US"),
    voices.find((v) => v.lang.startsWith("en")),
    voices[0],
  ];
  return preferred.find(Boolean) ?? null;
}

export function useVoiceOutput(): VoiceOutputState {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;    // slightly slower — feels more contemplative
      utterance.pitch = 1.05;
      utterance.volume = 0.9;

      // Voices load asynchronously on some browsers
      const setVoiceAndSpeak = () => {
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      };

      if (speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
          speechSynthesis.onvoiceschanged = null;
        };
      }
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // Cancel speech on unmount
  useEffect(() => () => { if (supported) speechSynthesis.cancel(); }, [supported]);

  return { speaking, supported, speak, stop };
}
