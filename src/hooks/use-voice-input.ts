/**
 * use-voice-input.ts
 * Wraps the browser's Web Speech API (SpeechRecognition) to provide
 * a React-friendly hook for converting speech → text.
 *
 * Gracefully degrades when the browser doesn't support the API.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export type VoiceInputState = {
  /** True while the mic is actively listening */
  listening: boolean;
  /** The recognised transcript so far (resets each `start()` call) */
  transcript: string;
  /** Error message if recognition fails */
  error: string | null;
  /** True if the browser supports SpeechRecognition */
  supported: boolean;
  /** Start listening */
  start: () => void;
  /** Stop listening */
  stop: () => void;
  /** Clear accumulated transcript */
  clear: () => void;
};

export function useVoiceInput(): VoiceInputState {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const Ctor =
    typeof window !== "undefined"
      ? window.SpeechRecognition ?? window.webkitSpeechRecognition
      : undefined;

  const supported = !!Ctor;

  // Lazily build the recognition instance
  const getRecognition = useCallback((): SpeechRecognitionInstance | null => {
    if (!Ctor) return null;
    if (recognitionRef.current) return recognitionRef.current;

    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "no-speech") setError(event.error);
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    return rec;
  }, [Ctor]);

  const start = useCallback(() => {
    if (!supported) return;
    setError(null);
    setTranscript("");
    const rec = getRecognition();
    if (!rec) return;
    try {
      rec.start();
      setListening(true);
    } catch {
      // already running — ignore
    }
  }, [supported, getRecognition]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const clear = useCallback(() => setTranscript(""), []);

  // Clean up on unmount
  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { listening, transcript, error, supported, start, stop, clear };
}
