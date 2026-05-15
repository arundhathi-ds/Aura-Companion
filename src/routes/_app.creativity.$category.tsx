import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Shuffle, Sparkles, Wind, Palette, Music2, Feather, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { CREATIVITY, type CreativityCategory, pickPrompt } from "@/data/creativity";
import { Particles } from "@/components/companion/Particles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreativity } from "@/lib/creativity/use-creativity";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/creativity/$category")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${(CREATIVITY as any)[params.category]?.label ?? "Studio"} — Life Companion` },
    ],
  }),
});

// ───────────────────────────── Mood + inspiration data ─────────────────────────────

const MOODS = [
  { key: "tender", label: "Tender" },
  { key: "restless", label: "Restless" },
  { key: "luminous", label: "Luminous" },
  { key: "melancholy", label: "Melancholy" },
  { key: "wild", label: "Wild" },
  { key: "still", label: "Still" },
] as const;
type MoodKey = (typeof MOODS)[number]["key"];

// Emotion → palette for the painting studio
const EMOTION_PALETTES: Record<MoodKey, { name: string; colors: string[]; whisper: string }> = {
  tender:    { name: "Soft dawn",    colors: ["#f4d3d8", "#e9b1c1", "#c98aa8", "#7a5e8a"], whisper: "Begin where the day is still half-asleep." },
  restless:  { name: "Ember storm",  colors: ["#ffb088", "#ff6b6b", "#c33764", "#1d2671"], whisper: "Let the brush move faster than your thoughts." },
  luminous:  { name: "Citrine sky",  colors: ["#fff3a3", "#ffd166", "#ef8354", "#a06cd5"], whisper: "Paint as if the sun were watching you back." },
  melancholy:{ name: "Indigo rain",  colors: ["#bcd4e6", "#7896c0", "#3a4f7a", "#1a1a2e"], whisper: "The blue is not sadness. It is room to breathe." },
  wild:     { name: "Aurora bloom", colors: ["#73ffb8", "#2dd4a8", "#a78bfa", "#f472b6"], whisper: "Use a color that scares you a little." },
  still:     { name: "Linen quiet",  colors: ["#f5f0e8", "#dce5d4", "#a8c0a0", "#7d9b76"], whisper: "Make a small piece. Let the silence stay." },
};

// Floating inspiration micro-cards (per studio)
const INSPIRATION: Record<CreativityCategory, string[]> = {
  photography: [
    "Find the softest light in the room.",
    "Photograph what your hands have been holding.",
    "Frame a window like it's a painting.",
    "Capture one thing that won't exist tomorrow.",
    "Shoot a reflection without yourself in it.",
  ],
  painting: [
    "Two colors, one feeling.",
    "Paint the weather inside your chest.",
    "Make a mark you don't understand.",
    "Let a color you usually avoid lead.",
    "Smudge something on purpose.",
  ],
  dance: [
    "Move only your shoulders for a verse.",
    "Let the floor hold half your weight.",
    "Find one gesture and repeat it slow.",
    "Dance the shape of a word.",
    "Stop on the next quiet beat.",
  ],
  writing: [
    "Write the sentence you almost deleted.",
    "Begin with: 'Today I noticed…'",
    "Describe a person using only weather.",
    "Write a line you'd whisper, not speak.",
    "End with a question that has no answer.",
  ],
  music: [
    "Hum a melody for 30 seconds.",
    "Find a song you forgot you loved.",
    "Listen with your eyes closed.",
    "Tap the rhythm of your breath.",
  ],
};

// Poetic guidance (one floating line under the prompt)
const POETICS: Record<CreativityCategory, string[]> = {
  photography: ["Light is a memory you can hold.", "The frame is small. The world fits anyway.", "Look slower than you usually do."],
  painting:    ["Color is a softer language for what's inside.", "The page is a place you're allowed to stay.", "Mistakes are how the painting begins."],
  dance:       ["The body remembers what the mouth forgot.", "Move first. Understand later.", "There is no audience here."],
  writing:     ["Six honest lines is enough.", "Write the page only you can write.", "The truest sentence first."],
  music:       ["Sound makes a room for feelings to sit in.", "Listen like you're being told a secret.", "Volume is a feeling."],
};

// Map category → primary icon
const CAT_ICON: Record<CreativityCategory, React.ComponentType<{ className?: string }>> = {
  photography: ImageIcon,
  painting: Palette,
  dance: Wind,
  writing: Feather,
  music: Music2,
};

// ───────────────────────────── Component ─────────────────────────────

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = (CREATIVITY as any)[category as CreativityCategory] as typeof CREATIVITY.photography | undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completed, finish } = useCreativity();

  const [mood, setMood] = useState<MoodKey>("luminous");
  const [prompt, setPrompt] = useState<string>(() =>
    pickPrompt((category as CreativityCategory) ?? "writing", new Date().toISOString().slice(0, 10))
  );
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [energy, setEnergy] = useState(3); // dance studio
  const [chosenColor, setChosenColor] = useState<string | null>(null); // painting
  const fileRef = useRef<HTMLInputElement>(null);

  const myCompleted = useMemo(
    () => completed.filter((c) => c.category === (category as CreativityCategory)).slice(0, 6),
    [completed, category]
  );

  const inspiration = useMemo(() => {
    const list = cat ? INSPIRATION[cat.key] : [];
    // pick 4 deterministic-ish per session
    return [...list].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [cat]);

  const poetic = useMemo(() => {
    const list = cat ? POETICS[cat.key] : [];
    return list[Math.floor(Math.random() * list.length)] ?? "";
  }, [cat]);

  useEffect(() => {
    setDone(false); setContent(""); setReflection(""); setPhotoUrl(null); setExtraPhotos([]); setChosenColor(null);
  }, [category]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-muted-foreground">This studio is not open.</p>
        <Link to="/creativity" className="mt-4 inline-block text-primary-glow underline">Back to creativity</Link>
      </div>
    );
  }

  const Icon = CAT_ICON[cat.key];
  const palette = EMOTION_PALETTES[mood];

  const onPhoto = async (file: File, asExtra = false) => {
    if (!user) return;
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("memories").upload(path, file, { upsert: false });
    if (error) { toast.error("Couldn't upload"); return; }
    const { data } = supabase.storage.from("memories").getPublicUrl(path);
    if (asExtra) setExtraPhotos((p) => [...p, data.publicUrl]);
    else setPhotoUrl(data.publicUrl);
    toast.success("Held");
  };

  const moodInfusedPrompt = useMemo(() => {
    if (!cat) return prompt;
    const moodLabel = MOODS.find((m) => m.key === mood)?.label.toLowerCase();
    return `${prompt}  ·  feeling ${moodLabel}`;
  }, [prompt, mood, cat]);

  const save = async () => {
    try {
      const richReflection = [
        reflection,
        chosenColor ? `Color held: ${chosenColor}` : null,
        cat.key === "dance" ? `Energy: ${energy}/5` : null,
        extraPhotos.length ? `Extra frames: ${extraPhotos.length}` : null,
      ].filter(Boolean).join("  ·  ");
      await finish({
        category: cat.key,
        prompt: moodInfusedPrompt,
        content: content || null,
        reflection: richReflection || null,
        photo_url: photoUrl ?? extraPhotos[0] ?? null,
      });
      setDone(true);
      toast.success("Held in your memories");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Atmospheric hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="glass-strong relative overflow-hidden rounded-[2rem] p-6 md:p-12"
      >
        {/* layered animated background */}
        <div className="absolute inset-0 -z-10" style={{ background: cat.gradient }} />
        <motion.div
          aria-hidden
          className="absolute -left-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, ${cat.tint} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-24 -right-24 -z-10 h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl"
          style={{ background: `radial-gradient(circle, ${palette.colors[2]} 0%, transparent 70%)` }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <Particles count={26} />

        <div className="relative">
          <Link to="/creativity"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs backdrop-blur hover:border-primary/40">
            <ArrowLeft className="h-3.5 w-3.5" /> Studios
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-background/40 backdrop-blur ring-1 ring-white/10"
              style={{ boxShadow: `0 0 40px ${cat.tint}` }}
            >
              <Icon className="h-5 w-5 text-primary-glow" />
            </motion.div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-glow">{cat.label} studio</p>
          </div>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">{cat.tagline}</h1>
          <motion.p
            key={poetic}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-4 max-w-xl text-sm italic text-muted-foreground md:text-base"
          >
            "{poetic}"
          </motion.p>

          {/* Mood selector */}
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">How does today feel?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = m.key === mood;
                return (
                  <button key={m.key} onClick={() => setMood(m.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs backdrop-blur transition ${
                      active
                        ? "border-primary/60 bg-primary/15 text-foreground shadow-[0_0_20px_oklch(0.78_0.16_295/0.4)]"
                        : "border-border/60 bg-background/30 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Prompt + floating inspiration */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="glass relative overflow-hidden rounded-3xl p-6"
        >
          <Sparkles className="absolute right-5 top-5 h-4 w-4 text-primary-glow/60" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Today's invitation</p>
          <AnimatePresence mode="wait">
            <motion.h2 key={prompt + mood}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-2xl leading-snug md:text-3xl">
              {prompt}
            </motion.h2>
          </AnimatePresence>
          <p className="mt-3 text-xs text-muted-foreground">
            Tuned to your <span className="text-foreground">{MOODS.find(m=>m.key===mood)?.label.toLowerCase()}</span> weather.
          </p>
          <div className="mt-5">
            <Button variant="outline" size="sm" onClick={() => setPrompt(pickPrompt(cat.key, crypto.randomUUID()))}>
              <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Another invitation
            </Button>
          </div>
        </motion.section>

        {/* Floating inspiration cards */}
        <section className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Drift through these</p>
          <div className="mt-3 space-y-3">
            {inspiration.map((line, i) => (
              <motion.div key={line}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <motion.div
                  className="glass cursor-default rounded-2xl p-3 text-sm"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  style={{ boxShadow: `0 8px 30px -12px ${cat.tint}` }}
                >
                  {line}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Studio-specific workspace */}
      {!done && (
        <section className="mt-6 grid gap-6">
          {/* PHOTOGRAPHY: visual storytelling + memory uploads */}
          {cat.key === "photography" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Visual storytelling</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture three frames that, together, tell a small story. They don't need to make sense — only feel true.
              </p>

              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0], extraPhotos.length + (photoUrl?1:0) > 0)} />

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[photoUrl, ...extraPhotos].filter(Boolean).map((url, i) => (
                  <motion.div key={String(url)+i}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10"
                  >
                    <img src={url as string} alt="" className="h-full w-full object-cover" />
                  </motion.div>
                ))}
                <button onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-2xl border border-dashed border-border/60 bg-background/30 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                  <Camera className="mx-auto mb-1 h-5 w-5" />
                  Add a frame
                </button>
              </div>
            </div>
          )}

          {/* PAINTING: emotion-to-color */}
          {cat.key === "painting" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Emotion → color</p>
              <h3 className="mt-2 font-display text-xl">{palette.name}</h3>
              <p className="mt-1 text-sm italic text-muted-foreground">"{palette.whisper}"</p>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {palette.colors.map((c) => {
                  const active = chosenColor === c;
                  return (
                    <motion.button key={c} onClick={() => setChosenColor(c)}
                      whileHover={{ y: -3 }}
                      className={`relative aspect-square rounded-2xl ring-1 transition ${active ? "ring-primary-glow" : "ring-white/10"}`}
                      style={{ background: c, boxShadow: active ? `0 0 40px ${c}` : `0 0 18px ${c}80` }}
                    >
                      <span className="absolute bottom-1 left-1 right-1 truncate rounded-md bg-black/40 px-1 py-0.5 text-[10px] text-white/90 backdrop-blur">
                        {c}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {chosenColor && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Building today around <span className="text-foreground">{chosenColor}</span>. Let it be the loudest voice on the page.
                </p>
              )}
            </div>
          )}

          {/* DANCE: energy + ambient flow */}
          {cat.key === "dance" && (
            <div className="glass relative overflow-hidden rounded-3xl p-6">
              {/* ambient flow visual */}
              <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70"
                style={{
                  background: `radial-gradient(60% 60% at 30% 40%, ${palette.colors[1]}55, transparent 60%),
                              radial-gradient(50% 50% at 80% 70%, ${palette.colors[3]}55, transparent 60%)`,
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Movement energy</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">still</span>
                <input type="range" min={1} max={5} value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-primary" />
                <span className="text-xs text-muted-foreground">wild</span>
              </div>
              <div className="mt-5 grid place-items-center">
                <motion.div
                  className="h-40 w-40 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${palette.colors[2]}, ${palette.colors[3]})`,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    scale: [1, 1 + energy * 0.04, 1],
                    rotate: [0, energy * 30, 0],
                  }}
                  transition={{ duration: 6 - energy * 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {energy <= 2 ? "Slow. Let gravity do the work." : energy === 3 ? "A steady pulse. Find one shape and stay with it." : "Push. Let the body lead."}
              </p>
            </div>
          )}

          {/* WRITING: poetic immersive environment */}
          {cat.key === "writing" && (
            <div className="glass relative overflow-hidden rounded-3xl p-6">
              <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-50"
                style={{ background: `linear-gradient(180deg, ${palette.colors[0]}22, transparent 60%)` }}
                animate={{ opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">A page for you</p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={`Begin slowly… write the line you almost wouldn't.`}
                className="mt-3 min-h-[260px] resize-none rounded-2xl border-border/60 bg-background/30 font-display text-lg leading-relaxed tracking-wide backdrop-blur placeholder:italic placeholder:text-muted-foreground/70"
              />
              <p className="mt-2 text-right text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{content.trim().split(/\s+/).filter(Boolean).length} words</p>
            </div>
          )}

          {/* MUSIC: simple notes panel */}
          {cat.key === "music" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Liner notes</p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Songs, lyrics, the shape of the sound…"
                className="mt-3 min-h-[180px] resize-none rounded-2xl border-border/60 bg-background/40 backdrop-blur" />
            </div>
          )}

          {/* Reflection + save */}
          <div className="glass rounded-3xl p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">A small reflection</p>
            <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)}
              placeholder="What did the act of doing this open in you?"
              className="mt-3 min-h-[100px] resize-none rounded-2xl border-border/60 bg-background/40 backdrop-blur" />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {cat.key !== "photography" && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && onPhoto(e.target.files[0])} />
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> {photoUrl ? "Change photo" : "Add a photo"}
                  </Button>
                  {photoUrl && <img src={photoUrl} alt="upload" className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/10" />}
                </>
              )}
              <div className="ml-auto">
                <Button onClick={save}><Check className="mr-2 h-4 w-4" /> Save to memories</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Done */}
      {done && (
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-8 glass-strong relative overflow-hidden rounded-[2rem] p-10 text-center"
        >
          <div className="absolute inset-0 -z-10 opacity-90" style={{ background: cat.gradient }} />
          <Particles count={24} />
          <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">Held</p>
          <h2 className="mt-3 font-display text-3xl">Beautifully done.</h2>
          <p className="mt-2 text-sm italic text-muted-foreground">"{poetic}"</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={() => { setDone(false); setPrompt(pickPrompt(cat.key, crypto.randomUUID())); }}>Try another invitation</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/memories" })}>See memories</Button>
          </div>
        </motion.section>
      )}

      {/* Past in this studio */}
      {myCompleted.length > 0 && (
        <section className="mt-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">From this studio</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCompleted.map((c, i) => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass overflow-hidden rounded-3xl"
              >
                {c.photo_url && <img src={c.photo_url} alt="" className="h-36 w-full object-cover" />}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{new Date(c.completed_at).toLocaleDateString()}</p>
                  <p className="mt-1 line-clamp-2 text-sm">{c.prompt}</p>
                  {c.reflection && <p className="mt-2 line-clamp-3 text-xs italic text-muted-foreground">"{c.reflection}"</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}