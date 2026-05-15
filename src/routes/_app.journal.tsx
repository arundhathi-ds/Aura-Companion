import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Send, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Particles } from "@/components/companion/Particles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useJournals } from "@/lib/journals/use-journals";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { analyzeJournal } from "@/lib/ai/companion.functions";

export const Route = createFileRoute("/_app/journal")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Journal — Life Companion" },
      { name: "description", content: "A private place to write what the day held." },
    ],
  }),
});

const MOODS = ["calm", "curious", "heavy", "hopeful", "restless", "tender"];
const PROMPTS = [
  "What surprised you today?",
  "What softened, even slightly?",
  "What needed more attention than you gave it?",
  "Where in your body is today sitting?",
  "What would you tell yourself, gently, right now?",
  "Who or what do you feel grateful to have crossed today?",
];

function Page() {
  const { journals, addJournal, isPending } = useJournals();
  const { logs, logMood } = useMoodLogs();
  const analyze = useServerFn(analyzeJournal);

  const [mood, setMood] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setAnalyzing(true);
    let emotion: string | null = null, summary: string | null = null;
    try {
      const r = await analyze({ data: { content, mood } });
      emotion = r.emotion;
      summary = r.summary;
    } catch (err: any) {
      // continue without analysis
      console.warn("AI analyze failed", err);
    }
    try {
      await addJournal({ content, mood, prompt, ai_emotion: emotion, ai_summary: summary });
      if (mood) await logMood({ mood }).catch(() => {});
      setContent("");
      setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
      toast.success("Held in your journal");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    } finally {
      setAnalyzing(false);
    }
  };

  /* Trends — last 14 days mood frequency */
  const trends = useMemo(() => {
    const counts: Record<string, number> = {};
    [...journals.map((j) => j.mood), ...logs.map((l) => l.mood)]
      .filter(Boolean)
      .slice(0, 30)
      .forEach((m) => { counts[m as string] = (counts[m as string] ?? 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return MOODS.map((m) => ({ mood: m, pct: Math.round(((counts[m] ?? 0) / total) * 100) }));
  }, [journals, logs]);

  return (
    <div className="mx-auto max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <Particles count={16} />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">A private companion</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
          Tell the day what it <span className="text-aurora">left in you</span>.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Write a little. Your companion will reflect, gently — never advise.
        </p>
      </motion.header>

      <form onSubmit={submit}
        className="mt-6 glass-strong rounded-3xl p-6 md:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">How are you feeling</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button type="button" key={m} onClick={() => setMood(m)}
              className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
                mood === m ? "border-primary bg-primary/20 text-foreground shadow-[0_0_18px] shadow-primary/40"
                  : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
              }`}>{m}</button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-primary-glow">{prompt}</p>
          <Button type="button" size="sm" variant="ghost"
            onClick={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}>
            <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Another
          </Button>
        </div>

        <Textarea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Begin softly…"
          className="mt-3 min-h-[180px] resize-none rounded-2xl border-border/60 bg-background/40 backdrop-blur" />

        <div className="mt-4 flex items-center justify-end">
          <Button type="submit" disabled={!content.trim() || isPending || analyzing}
            style={{ boxShadow: "0 0 24px oklch(0.78 0.16 295 / 0.5)" }}>
            <Send className="mr-2 h-4 w-4" /> {analyzing ? "Listening…" : "Save entry"}
          </Button>
        </div>
      </form>

      {/* Trends */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Recent entries</p>
          {journals.length === 0 ? (
            <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">Nothing yet — your first words will live here.</div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {journals.slice(0, 12).map((j) => (
                  <motion.li key={j.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="glass rounded-3xl p-5"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(j.created_at).toLocaleString()}</span>
                      {j.mood && (
                        <span className="rounded-full border border-border bg-background/30 px-2 py-0.5 capitalize">{j.mood}</span>
                      )}
                      {j.ai_emotion && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-primary-glow">
                          <Sparkles className="h-3 w-3" /> {j.ai_emotion}
                        </span>
                      )}
                    </div>
                    {j.prompt && <p className="mt-2 text-xs italic text-muted-foreground">{j.prompt}</p>}
                    <p className="mt-2 whitespace-pre-wrap text-sm">{j.content}</p>
                    {j.ai_summary && (
                      <div className="mt-3 rounded-2xl border border-aurora/20 bg-aurora/10 p-3 text-sm italic text-foreground/90"
                        style={{ boxShadow: "0 0 24px -10px oklch(0.82 0.15 200 / 0.5)" }}>
                        "{j.ai_summary}"
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <aside className="glass-strong rounded-3xl p-5 h-fit">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Mood trends</p>
          <ul className="mt-4 space-y-3">
            {trends.map((t, i) => (
              <li key={t.mood}>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize">{t.mood}</span>
                  <span className="text-muted-foreground">{t.pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/40">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-glow))" }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] text-muted-foreground">Across recent entries and check-ins.</p>
        </aside>
      </section>
    </div>
  );
}
