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
    queryFn: async () => (await supabase.from("profiles").select("current_mood").eq("id", user!.id).maybeSingle()).data,
  });
  const { completedList } = useCompletedExperiences();
  const { logs } = useMoodLogs();

  useEffect(() => {
    scroller.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs, pending, open]);

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
      const r = await chat({ data: {
        message,
        history: msgs.slice(-10),
        context: { mood: profile?.current_mood ?? null, recentExperiences, recentMoods },
      }});
      setMsgs((m) => [...m, { role: "assistant", content: r.reply }]);
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
          background: "var(--gradient-orb)",
          boxShadow: "0 0 40px oklch(0.78 0.16 295 / 0.7), 0 0 80px oklch(0.85 0.18 320 / 0.4)",
        }}
        aria-label="Open companion"
      >
        <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          {open ? <X className="h-5 w-5 text-primary-foreground" /> : <Sparkles className="h-5 w-5 text-primary-foreground" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="glass-strong fixed bottom-24 right-5 z-50 flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl"
            style={{ boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.7)" }}
          >
            <div className="relative overflow-hidden p-4">
              <motion.div aria-hidden className="absolute -inset-10 opacity-70"
                style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.16 295 / 0.45), transparent 60%)", filter: "blur(40px)" }}
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your companion</p>
                <p className="mt-1 font-display text-lg">Whatever you bring, I'll hold it gently.</p>
              </div>
            </div>

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
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}