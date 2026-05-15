import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bookmark, Camera, Check, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { EXPERIENCES, CATEGORY_META } from "@/data/experiences";
import { stepsFor } from "@/data/experience-steps";
import { Particles } from "@/components/companion/Particles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSavedExperiences } from "@/lib/experience/use-saved-experiences";
import { useCompletedExperiences } from "@/lib/experience/use-completed";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/experiences/$slug")({
  component: ExperienceDetail,
  head: ({ params }) => ({
    meta: [
      { title: `${EXPERIENCES.find((e) => e.slug === params.slug)?.title ?? "Experience"} — Life Companion` },
    ],
  }),
});

const MOODS = ["calm", "curious", "heavy", "hopeful", "restless", "tender"];

/** Soft generative ambient using WebAudio — works without external assets. */
function useAmbient() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    nodesRef.current?.stop();
    nodesRef.current = null;
    setPlaying(false);
  };

  const start = () => {
    if (typeof window === "undefined") return;
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);

    // Two slow detuned sine pads
    const freqs = [196, 246.94]; // G3, B3
    const oscs = freqs.map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      o.connect(g).connect(master);
      o.start();
      // very slow LFO on gain
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07 + Math.random() * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.35;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      return { o, g, lfo };
    });

    nodesRef.current = {
      stop: () => {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => {
          oscs.forEach(({ o, lfo }) => { try { o.stop(); lfo.stop(); } catch {} });
        }, 700);
      },
    };
    setPlaying(true);
  };

  useEffect(() => () => stop(), []);

  return { playing, toggle: () => (playing ? stop() : start()) };
}

function ExperienceDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const exp = useMemo(() => EXPERIENCES.find((e) => e.slug === slug), [slug]);
  const steps = useMemo(() => (exp ? stepsFor(exp.slug) : []), [exp]);
  const meta = exp ? CATEGORY_META[exp.category] : null;

  const { savedSlugs, toggleSave } = useSavedExperiences();
  const { complete } = useCompletedExperiences();
  const ambient = useAmbient();

  const [moodBefore, setMoodBefore] = useState<string | null>(null);
  const [moodAfter, setMoodAfter] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [reflection, setReflection] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = steps[step]?.seconds ?? 0;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { setSeconds(0); }, [step]);

  const progress = steps.length === 0 ? 0 : ((step + (total ? Math.min(seconds / total, 1) : 0)) / steps.length) * 100;

  if (!exp || !meta) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-muted-foreground">This experience drifted out of view.</p>
        <Link to="/experiences" className="mt-4 inline-block text-primary-glow underline">Back to experiences</Link>
      </div>
    );
  }
  const saved = savedSlugs.has(exp.slug);

  const onPhoto = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("memories").upload(path, file, { upsert: false });
    if (error) { toast.error("Couldn't save the image"); return; }
    const { data } = supabase.storage.from("memories").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    toast.success("Photo added");
  };

  const finish = async () => {
    try {
      await complete({
        experience_slug: exp.slug,
        mood_before: moodBefore,
        mood_after: moodAfter,
        note: reflection || null,
        photo_url: photoUrl,
        duration_min: exp.durationMin,
      });
      setDone(true);
      ambient.playing && ambient.toggle();
      toast.success("Saved to your memories");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-[2rem] p-6 md:p-10"
      >
        <div className="absolute inset-0 -z-10 opacity-90" style={{ background: exp.gradient }} />
        <Particles count={20} />
        <motion.div aria-hidden className="absolute -top-20 -right-20 h-72 w-72 rounded-full"
          style={{ background: `radial-gradient(circle, ${meta.tint}, transparent 65%)`, filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <Link to="/experiences"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs backdrop-blur hover:border-primary/40">
              <ArrowLeft className="h-3.5 w-3.5" /> Experiences
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={ambient.toggle}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/40 backdrop-blur hover:border-primary/40"
                aria-label="Ambient sound">
                {ambient.playing ? <Volume2 className="h-4 w-4 text-primary-glow" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button onClick={() => toggleSave(exp.slug)}
                className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
                  saved ? "border-primary/60 bg-primary/20 text-primary-glow" : "border-border bg-background/40 hover:border-primary/40"
                }`}
                aria-label="Save">
                <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary-glow">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.tint, boxShadow: `0 0 8px ${meta.tint}` }} />
            {meta.label} · {exp.vibe}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[1.1] md:text-5xl">{exp.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{exp.description}</p>
          <p className="mt-4 max-w-2xl text-sm italic text-foreground/80">"{exp.reasoning}"</p>
        </div>
      </motion.section>

      {/* MOOD BEFORE */}
      {!done && (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 glass rounded-3xl p-6"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">How does it feel right now</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button key={m} onClick={() => setMoodBefore(m)}
                className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
                  moodBefore === m ? "border-primary bg-primary/20 text-foreground shadow-[0_0_18px] shadow-primary/40" : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
                }`}>{m}</button>
            ))}
          </div>
        </motion.section>
      )}

      {/* STEPS + TIMER */}
      {!done && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-glow))" }}
                animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="mt-6"
              >
                <h2 className="font-display text-2xl md:text-3xl">{steps[step]?.title}</h2>
                <p className="mt-2 text-muted-foreground">{steps[step]?.detail}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => { setStep(Math.max(0, step - 1)); setRunning(false); }}>Back</Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => { setStep(step + 1); setRunning(false); }}>Next step</Button>
              ) : (
                <Button onClick={() => setStep(steps.length)}>Reflect</Button>
              )}
            </div>
          </div>

          {/* Timer */}
          <aside className="glass rounded-3xl p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Countdown</p>
            <div className="mt-3 grid place-items-center">
              <div className="relative h-40 w-40">
                <motion.div aria-hidden className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent), transparent 65%)", filter: "blur(20px)" }}
                  animate={{ scale: running ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <svg viewBox="0 0 100 100" className="relative h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="4" />
                  <motion.circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary-glow)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - (total ? Math.min(seconds / total, 1) : 0)) }}
                    transition={{ duration: 0.8 }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="font-display text-3xl tabular-nums">
                      {Math.floor(Math.max(0, (total - seconds)) / 60).toString().padStart(2, "0")}:
                      {Math.max(0, (total - seconds) % 60).toString().padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{total ? "remaining" : "no timer"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} disabled={!total}>
                {running ? <><Pause className="mr-1.5 h-3.5 w-3.5" /> Pause</> : <><Play className="mr-1.5 h-3.5 w-3.5" /> Start</>}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setSeconds(0); setRunning(false); }}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
              </Button>
            </div>
          </aside>
        </section>
      )}

      {/* REFLECTION */}
      {!done && step >= steps.length && (
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-strong rounded-3xl p-6 md:p-8"
        >
          <h3 className="font-display text-2xl">A small reflection</h3>
          <p className="mt-1 text-sm text-muted-foreground">No pressure. A line is enough.</p>

          <Textarea
            value={reflection} onChange={(e) => setReflection(e.target.value)}
            placeholder="What did you notice? What softened, what surfaced?"
            className="mt-4 min-h-[120px] resize-none rounded-2xl border-border/60 bg-background/40 backdrop-blur"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" /> {photoUrl ? "Change photo" : "Add a photo"}
            </Button>
            {photoUrl && (
              <img src={photoUrl} alt="reflection" className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/10" />
            )}
          </div>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">How does it feel now</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m} onClick={() => setMoodAfter(m)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
                    moodAfter === m ? "border-aurora bg-aurora/20 text-foreground shadow-[0_0_18px] shadow-aurora/40" : "border-border bg-background/30 text-muted-foreground hover:text-foreground"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={finish} className="rounded-full"
              style={{ boxShadow: "0 0 30px oklch(0.78 0.16 295 / 0.6)" }}>
              <Check className="mr-2 h-4 w-4" /> Save this memory
            </Button>
            <Button variant="ghost" onClick={() => setStep(steps.length - 1)}>Back to steps</Button>
          </div>
        </motion.section>
      )}

      {/* DONE */}
      <AnimatePresence>
        {done && (
          <motion.section
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="mt-8 glass-strong relative overflow-hidden rounded-[2rem] p-10 text-center"
          >
            <Particles count={28} />
            <motion.div aria-hidden className="absolute inset-0 -z-10"
              style={{ background: "radial-gradient(circle at 50% 30%, oklch(0.85 0.18 320 / 0.4), transparent 60%)" }}
              animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">Held in your constellation</p>
            <h2 className="mt-3 font-display text-4xl">Beautifully done.</h2>
            <p className="mt-3 mx-auto max-w-md text-muted-foreground">
              Your companion is keeping this for you. Visit it anytime in your memories.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => navigate({ to: "/memories" })}>See your memories</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/experiences" })}>Find another</Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}