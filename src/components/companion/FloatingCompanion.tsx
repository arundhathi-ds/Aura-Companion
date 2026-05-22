import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useCompletedExperiences } from "@/lib/experience/use-completed";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { companionChat } from "@/lib/ai/companion.functions";
import { getCompanionResponse, CompanionInput } from "@/core/companion-engine";
import { EmotionDebugOverlay } from "@/components/companion/EmotionDebugOverlay";
import { getMemorySummary } from '@/lib/emotion/emotion-memory';
import { useAtmosphere } from '@/components/atmosphere/AtmosphereProvider';
import { EXPERIENCES } from "@/data/experiences";

type Msg = { role: "user" | "assistant"; content: string };

export function FloatingCompanion() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const chat = useServerFn(companionChat);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const { completedList } = useCompletedExperiences();
  const { logs } = useMoodLogs();

  const [isQuiet, setIsQuiet] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("aura_quiet_mode") === "true"
  );

  const { breathing, current } = useAtmosphere();
  const [ambientLine, setAmbientLine] = useState<string | null>(null);

  useEffect(() => {
    if (!current?.key) return;
    let line: string | null = null;
    switch (current.key) {
      case 'rainy-window': line = 'The city feels quieter tonight.'; break;
      case 'neon-city': line = "Neon streets hum in the distance."; break;
      case 'dreamy': line = 'Tonight feels distant and soft.'; break;
      case 'hyper-mode': line = "You're carrying momentum right now."; break;
      case 'deep-focus': line = 'The room narrows and attention widens.'; break;
      default: line = null;
    }
    if (line) {
      setAmbientLine(line);
      const t = setTimeout(() => setAmbientLine(null), 6000);
      return () => clearTimeout(t);
    }
  }, [current?.key]);

  useEffect(() => {
    const handleSync = () => {
      setIsQuiet(localStorage.getItem("aura_quiet_mode") === "true");
    };
    window.addEventListener("aura_quiet_mode_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("aura_quiet_mode_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs, pending, open]);

  // occasional memory-based companion line when opened
  useEffect(() => {
    if (!open) return;
    try {
      const summary = getMemorySummary();
      const top = summary.preferences?.[0];
      if (top && Math.random() < 0.35) {
        // gentle poetic references without being explicit
        const subtle = [
          `You return here often when the world gets quieter.`,
          `I notice certain nights have their own light — perhaps tonight is one of them.`,
          `There are colors you visit more than once. The room remembers those hues.`,
          `Some evenings call for hush; some call for pulse. I can feel which tonight asks for.`,
        ];
        const pick = subtle[Math.floor(Math.random() * subtle.length)];
        setMsgs((m) => [...m, { role: 'assistant', content: pick }]);
      }
    } catch {}
  }, [open]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = text.trim();
    if (!message || pending) return;
    setMsgs((m) => [...m, { role: "user", content: message }]);
    setText("");
    setPending(true);
    try {
      const recentExperiences = completedList.slice(0, 5)
        .map((c) => EXPERIENCES.find((e) => e.slug === c.experience_slug)?.title)
        .filter((x): x is string => !!x);
      const recentMoods = logs.slice(0, 5).map((l) => l.mood);

      const context = {
        mood: profile?.current_mood ?? null,
        recentExperiences,
        recentMoods,
        timeOfDay: new Date().toISOString(),
      };

      // Ask the skill engine first; provide a safe fallback that calls the existing server LLM
      const input: CompanionInput = { text: message, context };

      const fallback = async (inp: CompanionInput) => {
        // reuse existing server function; maintain same payload shape
        const pref = profile?.tone_preference?.toLowerCase() ?? "";
        const personality = ["whisper", "guide", "playful", "poet"].includes(pref)
          ? (pref as "whisper" | "guide" | "playful" | "poet")
          : "guide";
        const serverRes = await chat({ data: {
          message: inp.text,
          history: msgs.slice(-10),
          context: { mood: profile?.current_mood ?? null, recentExperiences, recentMoods },
          localTimeStr: new Date().toISOString(),
          personality,
        }});
        return { reply: serverRes.reply };
      };

      const res = await getCompanionResponse(input, fallback);
      const replyText = (res as any).text ?? (res as any).reply ?? "I'm here. Tell me more.";
      setMsgs((m) => [...m, { role: "assistant", content: replyText }]);
    } catch (err: any) {
      setMsgs((m) => [...m, { role: "assistant", content: "I'm here, but my voice slipped for a moment. Try once more?" }]);
    } finally {
      setPending(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* trigger */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full"
        style={{
          background: isQuiet ? "radial-gradient(circle, oklch(0.25 0.02 240) 0%, oklch(0.12 0.01 240) 100%)" : "var(--gradient-orb)",
          boxShadow: isQuiet 
            ? "0 0 20px oklch(0.25 0.02 240 / 0.3), inset 0 0 12px oklch(0.6 0.03 240 / 0.1)"
            : "0 0 40px oklch(0.78 0.16 295 / 0.7), 0 0 80px oklch(0.85 0.18 320 / 0.4)",
          border: isQuiet ? "1px border border-border/30" : "none",
        }}
        aria-label="Open companion"
      >
        <motion.div animate={{ rotate: [0, 6, -6, 0], scale: [1, 1 + (breathing - 0.5) * 0.06, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          {open ? <X className="h-5 w-5 text-primary-foreground" /> : <Sparkles className="h-5 w-5 text-primary-foreground" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`glass-strong fixed bottom-24 right-5 z-50 flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl ${
              isQuiet ? "bg-black/90 border-border/20 shadow-none" : ""
            }`}
            style={{ boxShadow: isQuiet ? "none" : "0 30px 80px -20px oklch(0 0 0 / 0.7)" }}
          >
            <div className="relative overflow-hidden p-4">
              <motion.div aria-hidden className="absolute -inset-10 opacity-70"
                style={{ 
                  background: isQuiet 
                    ? "radial-gradient(circle at 30% 30%, oklch(0.25 0.02 240 / 0.2), transparent 60%)"
                    : "radial-gradient(circle at 30% 30%, oklch(0.78 0.16 295 / 0.45), transparent 60%)", 
                  filter: "blur(40px)" 
                }}
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {isQuiet ? "Quiet Sanctuary" : "Your companion"}
                </p>
                <p className="mt-1 font-display text-lg">
                  {isQuiet ? "The stars are quiet tonight." : (ambientLine ?? "Whatever you bring, I'll hold it gently.")}
                </p>
              </div>
            </div>

            {isQuiet ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5">
                <motion.div 
                  animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="h-16 w-16 rounded-full bg-background/40 border border-border/40 flex items-center justify-center text-muted-foreground/60 shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <div className="space-y-2 max-w-xs">
                  <p className="font-display text-md text-foreground/90">Quiet Mode Active</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No demands. No tasks. Just hold space for yourself here in this quiet corner.
                  </p>
                </div>
                <div className="rounded-full bg-background/30 border border-border/40 px-4 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-display">
                  Still · Here · Rest · No rush
                </div>
              </div>
            ) : (
              <>
                <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-2">
                  {msgs.length === 0 && (
                    <div className="rounded-2xl border border-border/50 bg-background/30 p-3 text-xs text-muted-foreground">
                      Tell me how today is sitting in you. I'll listen — and if it helps, I'll suggest a small experience.
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {msgs.map((m, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm backdrop-blur-xl ${
                          m.role === "user"
                            ? "bg-primary/25 border border-primary/40"
                            : "glass border-aurora/20"
                        }`}
                          style={m.role === "assistant" ? { boxShadow: "0 0 24px -10px oklch(0.82 0.15 200 / 0.5)" } : undefined}>
                          {m.content}
                        </div>
                      </motion.div>
                    ))}
                    {pending && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="glass flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-primary-glow"
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <form onSubmit={send}
                  className="m-3 flex items-center gap-2 rounded-full border border-border bg-background/40 p-1.5 pl-4 backdrop-blur-xl focus-within:border-primary/60">
                  <input value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Whisper what's here…"
                    className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground" />
                  <motion.button type="submit" whileTap={{ scale: 0.9 }}
                    disabled={pending || !text.trim()}
                    className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                    style={{ boxShadow: "0 0 20px oklch(0.78 0.16 295 / 0.6)" }}>
                    <Send className="h-4 w-4" />
                  </motion.button>
                </form>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <EmotionDebugOverlay />
    </>
  );
}