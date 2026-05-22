import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bookmark, Wind, Flame, Cloud, Heart, Brain, Users, Zap, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AICompanionOrb } from "@/components/companion/AICompanionOrb";
import { Particles } from "@/components/companion/Particles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DailyJourney } from "@/components/experience/DailyJourney";
import { useSavedExperiences } from "@/lib/experience/use-saved-experiences";
import { CATEGORY_META } from "@/data/experiences";
import { companionChat } from "@/lib/ai/companion.functions";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { useJournals } from "@/lib/journals/use-journals";
import { useCompletedExperiences } from "@/lib/experience/use-completed";
import { useCreativity } from "@/lib/creativity/use-creativity";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useVoiceOutput } from "@/hooks/use-voice-output";
import { SmartMusicPlayer } from "@/components/spotify/SmartMusicPlayer";
import { CategoryBrowser } from "@/components/spotify/CategoryBrowser";


export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Life Companion" }] }),
});

const PLACEHOLDERS = [
  "How are you feeling today?",
  "What kind of experience do you need?",
  "What feels emotionally missing lately?",
  "Whisper what's on your mind…",
];

const GREETINGS = (name: string, mood?: string | null) => {
  const m = (mood ?? "").toLowerCase();
  const base: Record<string, string> = {
    calm:      `Hey ${name} ✨ Your energy feels calm but uninspired. Let's rediscover something beautiful.`,
    curious:   `Hey ${name} ✨ Your mind seems creatively restless today.`,
    heavy:     `Hey ${name} — you feel emotionally overloaded today. Maybe you need quiet moments instead of pressure.`,
    hopeful:   `Hey ${name} ✨ A soft brightness is moving through you. Let's give it somewhere to land.`,
    restless:  `Hey ${name} — there's a quiet storm under your skin today. Let's translate it into something gentle.`,
    tender:    `Hey ${name} — you're holding something fragile today. Let's hold it together.`,
  };
  return base[m] ?? `Hey ${name} ✨ I sense an unnamed weather inside you. Want to explore it together?`;
};

type Msg = { id: string; from: "you" | "ai"; text: string };

function greetingFor() {
  const h = new Date().getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Late hours";
}

function Dashboard() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chat = useServerFn(companionChat);
  const voice = useVoiceInput();
  const tts = useVoiceOutput();
  const { logs, logMood } = useMoodLogs();
  const { journals } = useJournals();
  const { completedList } = useCompletedExperiences();
  const { completed: creativity } = useCreativity();

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 4500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { scrollerRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages, typing]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile && profile.onboarding_completed === false) window.location.href = "/onboarding";
  }, [profile]);

  const name = profile?.display_name || user?.email?.split("@")[0] || "there";
  const greeting = useMemo(() => GREETINGS(name, profile?.current_mood), [name, profile?.current_mood]);

  // Sync voice transcript → message input
  useEffect(() => {
    if (voice.transcript) setMessage(voice.transcript);
  }, [voice.transcript]);

  // Auto-send when voice recognition ends with a transcript
  useEffect(() => {
    if (!voice.listening && voice.transcript.trim() && !typing) {
      send();
      voice.clear();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.listening]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = message.trim();
    if (!text || typing) return;
    const id = crypto.randomUUID();
    const history = messages.slice(-10).map((m) => ({ role: m.from === "you" ? "user" as const : "assistant" as const, content: m.text }));
    setMessages((m) => [...m, { id, from: "you", text }]);
    setMessage("");
    setTyping(true);
    try {
      const r = await chat({ data: {
        message: text,
        history,
        context: {
          mood: profile?.current_mood ?? null,
          recentMoods: logs.slice(0, 5).map((l) => l.mood),
          recentExperiences: completedList.slice(0, 5).map((c) => c.experience_slug),
        },
      }});
      setMessages((m) => [...m, { id: crypto.randomUUID(), from: "ai", text: r.reply }]);
      // Speak reply aloud if voice reply is enabled
      if (voiceReplyEnabled && tts.supported) tts.speak(r.reply);
    } catch {
      setMessages((m) => [...m, { id: crypto.randomUUID(), from: "ai", text: "I'm here — my voice slipped for a breath. Try again?" }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] glass-strong p-6 md:p-12">
        <Particles count={32} />
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.16 295 / 0.55), transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.15 200 / 0.5), transparent 70%)", filter: "blur(70px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative grid items-center gap-10 md:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1 }}
            className="mx-auto"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <AICompanionOrb size={260} />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{greetingFor()} · {new Date().toLocaleDateString(undefined, { weekday: "long" })}</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
              {greeting.split("✨")[0]}
              {greeting.includes("✨") && <span className="text-aurora">✨</span>}
              {greeting.split("✨")[1]}
            </h1>

            {/* Chat thread */}
            <div ref={scrollerRef} className="mt-6 max-h-56 space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm backdrop-blur-xl ${
                        m.from === "you"
                          ? "bg-primary/25 border border-primary/40 text-foreground"
                          : "glass border-aurora/20"
                      }`}
                      style={m.from === "ai" ? { boxShadow: "0 0 30px -10px oklch(0.82 0.15 200 / 0.5)" } : undefined}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                    <div className="glass flex items-center gap-1.5 rounded-2xl px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i} className="h-1.5 w-1.5 rounded-full bg-primary-glow"
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <form
              onSubmit={send}
              className="group mt-6 flex items-center gap-2 rounded-full border border-border bg-background/40 p-1.5 pl-5 backdrop-blur-xl transition focus-within:border-primary/60"
              style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.06), 0 0 0 0 transparent" }}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary-glow" />
              <div className="relative flex-1">
                <AnimatePresence mode="wait">
                  {!message && (
                    <motion.span
                      key={phIdx}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.6, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5 }}
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-muted-foreground"
                    >
                      {voice.listening ? "Listening…" : PLACEHOLDERS[phIdx]}
                    </motion.span>
                  )}
                </AnimatePresence>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="relative w-full bg-transparent py-2.5 text-sm outline-none"
                />
              </div>

              {/* Voice reply toggle — only shown if TTS is supported */}
              {tts.supported && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setVoiceReplyEnabled((v) => !v); if (tts.speaking) tts.stop(); }}
                  aria-label="Toggle voice reply"
                  className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                    voiceReplyEnabled
                      ? "border-aurora/60 bg-aurora/20 text-aurora"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {voiceReplyEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </motion.button>
              )}

              {/* Mic button — only shown if SpeechRecognition is supported */}
              {voice.supported && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => voice.listening ? voice.stop() : voice.start()}
                  aria-label={voice.listening ? "Stop listening" : "Speak to the Orb"}
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition hover:text-foreground"
                >
                  {voice.listening && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ background: "oklch(0.65 0.22 25 / 0.25)", boxShadow: "0 0 20px oklch(0.65 0.22 25 / 0.6)" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {voice.listening
                    ? <MicOff className="relative h-3.5 w-3.5 text-red-400" />
                    : <Mic className="h-3.5 w-3.5" />}
                </motion.button>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"
                style={{ boxShadow: "0 0 30px oklch(0.78 0.16 295 / 0.7), 0 0 60px oklch(0.85 0.18 320 / 0.4)" }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* EMOTIONAL JOURNEY + INSIGHTS */}
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <DailyJourney 
          user={user} 
          history={completedList.slice(0, 10).map(c => c.experience_slug).join(", ")}
        />
        <div className="space-y-4">
          <InsightsPanel
            mood={profile?.current_mood}
            counts={{
              moods: logs.length,
              journals: journals.length,
              completed: completedList.length,
              creativity: creativity.length,
            }}
            onLogMood={async (m) => {
              try { await logMood({ mood: m }); toast.success("Held"); } catch (e: any) { toast.error(e.message ?? "Couldn't save"); }
            }}
          />
          {/* Conversational music discovery — intent + weather → songs */}
          <SmartMusicPlayer />
          
          {/* Emotional soundtrack browser — interactive category atmosphere explorer */}
          <CategoryBrowser />
        </div>
      </section>
    </div>
  );
}
/* -------------------- Insights Panel -------------------- */

function InsightsPanel({
  mood, counts, onLogMood,
}: {
  mood?: string | null;
  counts: { moods: number; journals: number; completed: number; creativity: number };
  onLogMood: (m: string) => void | Promise<void>;
}) {
  const weatherByMood: Record<string, { label: string; icon: any; tint: string }> = {
    calm:     { label: "Calm Evening",      icon: Cloud, tint: "oklch(0.82 0.15 200)" },
    curious:  { label: "Quiet Curiosity",   icon: Sparkles, tint: "oklch(0.85 0.18 320)" },
    heavy:    { label: "Emotional Fog",     icon: Cloud, tint: "oklch(0.6 0.05 280)" },
    hopeful:  { label: "Soft Sunrise",      icon: Flame, tint: "oklch(0.82 0.18 50)" },
    restless: { label: "Inner Wind",        icon: Wind, tint: "oklch(0.78 0.16 295)" },
    tender:   { label: "Open Sky",          icon: Cloud, tint: "oklch(0.85 0.18 320)" },
  };
  const w = weatherByMood[(mood ?? "").toLowerCase()] ?? { label: "Creative Spark", icon: Sparkles, tint: "oklch(0.85 0.18 320)" };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
      className="space-y-4"
    >
      {/* Weather */}
      <div className="glass-strong relative overflow-hidden rounded-3xl p-5">
        <motion.div
          aria-hidden className="absolute -inset-10 opacity-70"
          style={{ background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${w.tint} 55%, transparent), transparent 60%)`, filter: "blur(40px)" }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Emotional weather</p>
          <div className="mt-3 flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-12 w-12 place-items-center rounded-full"
              style={{ background: `color-mix(in oklab, ${w.tint} 22%, transparent)`, boxShadow: `0 0 30px color-mix(in oklab, ${w.tint} 70%, transparent)` }}
            >
              <w.icon className="h-5 w-5" style={{ color: w.tint }} />
            </motion.span>
            <div>
              <p className="font-display text-2xl">{w.label}</p>
              <p className="text-xs text-muted-foreground">As your companion senses it now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse */}
      <div className="glass relative overflow-hidden rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <motion.span
            className="grid h-10 w-10 place-items-center rounded-full bg-primary/20"
            animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 0 0 oklch(0.78 0.16 295 / 0.6)", "0 0 30px 6px oklch(0.78 0.16 295 / 0.0)", "0 0 0 0 oklch(0.78 0.16 295 / 0)"] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <Zap className="h-4 w-4 text-primary-glow" />
          </motion.span>
          <div>
            <p className="text-sm">Your companion is awake</p>
            <p className="text-xs text-muted-foreground">Ready when you are · observing silently</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
