import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  Check,
  Shuffle,
  Sparkles,
  Wind,
  Palette,
  Music2,
  Feather,
  Image as ImageIcon,
  Film,
  Moon,
  BookOpen,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { CREATIVITY, type CreativityCategory, pickPrompt } from "@/data/creativity";
import { Particles } from "@/components/companion/Particles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreativity } from "@/lib/creativity/use-creativity";
import { useAuth } from "@/lib/auth-context";
import { useEmotionVisuals } from "@/hooks/useEmotionVisuals";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { useJournals } from "@/lib/journals/use-journals";

export const Route = createFileRoute("/_app/creativity/$category")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${(CREATIVITY as any)[params.category]?.label ?? "Studio"} � Life Companion` },
    ],
  }),
});

const MOODS = [
  { key: "tender", label: "Tender" },
  { key: "restless", label: "Restless" },
  { key: "luminous", label: "Luminous" },
  { key: "melancholy", label: "Melancholy" },
  { key: "wild", label: "Wild" },
  { key: "still", label: "Still" },
] as const;
type MoodKey = (typeof MOODS)[number]["key"];

const EMOTION_PALETTES: Record<MoodKey, { name: string; colors: string[]; whisper: string }> = {
  tender:    { name: "Soft dawn",    colors: ["#f4d3d8", "#e9b1c1", "#c98aa8", "#7a5e8a"], whisper: "Begin where the day is still half-asleep." },
  restless:  { name: "Ember storm",  colors: ["#ffb088", "#ff6b6b", "#c33764", "#1d2671"], whisper: "Let the brush move faster than your thoughts." },
  luminous:  { name: "Citrine sky",  colors: ["#fff3a3", "#ffd166", "#ef8354", "#a06cd5"], whisper: "Paint as if the sun were watching you back." },
  melancholy:{ name: "Indigo rain",  colors: ["#bcd4e6", "#7896c0", "#3a4f7a", "#1a1a2e"], whisper: "The blue is not sadness. It is room to breathe." },
  wild:     { name: "Aurora bloom", colors: ["#73ffb8", "#2dd4a8", "#a78bfa", "#f472b6"], whisper: "Use a color that scares you a little." },
  still:     { name: "Linen quiet",  colors: ["#f5f0e8", "#dce5d4", "#a8c0a0", "#7d9b76"], whisper: "Make a small piece. Let the silence stay." },
};

const INSPIRATION: Record<CreativityCategory, string[]> = {
  photography: [
    "Find the softest light in the room.",
    "Notice a reflection you almost missed.",
    "Frame a quiet corner like a painting.",
    "Capture one thing that feels both fragile and steady.",
  ],
  painting: [
    "Let one color whisper the rest of the piece.",
    "Paint the weather that lives inside you.",
    "Make a small mark and wait.",
    "Choose a shade that feels like a memory.",
  ],
  dance: [
    "Move one gesture slowly enough to feel it.",
    "Let the floor hold half your weight.",
    "Step with only one arm receiving the rhythm.",
    "Hold the pause as if it were melody.",
  ],
  writing: [
    "Write a line you would whisper to yourself.",
    "Describe today as a room with one window.",
    "Let one sentence be only about the weather inside you.",
    "Begin with a feeling and let the words follow.",
  ],
  music: [
    "Close your eyes and listen to the room.",
    "Name the first sound you hear after silence.",
    "Let the melody feel like evening light.",
    "Notice how a quiet sound shifts your breath.",
  ],
  film: [
    "Describe a single scene as if it were the opening shot.",
    "Choose the light, the motion, and the hush of the room.",
    "Write the first line of the scene as a soft memory.",
    "See a moment in shadow, then name its tone.",
  ],
  "midnight-walks": [
    "Find one street that feels like a hidden line of poetry.",
    "Notice the way the night holds a single sound.",
    "Describe a lamp or a door that seems to be waiting.",
    "Let your steps become a quiet story.",
  ],
  "memory-room": [
    "Recall a small detail from a room you once loved.",
    "Name one feeling from an old afternoon.",
    "Write the title of a memory you are ready to visit.",
    "Describe the light or color of a forgotten moment.",
  ],
  soundscape: [
    "Listen to the room as if it were a gentle composition.",
    "Find three layers of sound and give them a name.",
    "Describe the texture of the air in sound words.",
    "Let silence become one of the instruments.",
  ],
};

const POETICS: Record<CreativityCategory, string[]> = {
  photography: ["Light is a memory you can hold.", "The frame is small. The world fits anyway.", "Look slower than you usually do."],
  painting:    ["Color is a softer language for what's inside.", "The page is a place you're allowed to stay.", "Mistakes are how the painting begins."],
  dance:       ["The body remembers what the mouth forgot.", "Move first. Understand later.", "There is no audience here."],
  writing:     ["Six honest lines is enough.", "Write the page only you can write.", "The truest sentence first."],
  music:       ["Sound makes a room for feelings to sit in.", "Listen like you're being told a secret.", "Volume is a feeling."],
  film:        ["A scene does not need an audience to be true.", "The quietest stories are often the richest.", "Light is the first actor in every film."],
  "midnight-walks": ["The night hears what you do not say.", "A street can feel like a sentence.", "Walking slowly makes the unseen visible."],
  "memory-room": ["Some memories only open in quiet rooms.", "Hold one detail lightly.", "Remembering is a sacred ritual."],
  soundscape:   ["Sound is the shape of the space around you.", "The softest noise can carry the deepest feeling.", "Listen like the world is speaking just to you."],
};

const PHOTOGRAPHY_ENTRY_LINES = [
  "The studio opens slowly, like a door in the dark.",
  "Tonight is for one small frame that feels like it could glow from within.",
  "Notice the light that is already there, waiting to be seen.",
];

function generatePhotographyMission(mood: MoodKey, isLate: boolean, memoryCue: string) {
  const base = isLate
    ? "Capture a soft warmth in the cool dark."
    : "Find the quiet light in a small, ordinary corner.";

  if (memoryCue.includes("last mood")) {
    return `Capture the edge of ${mood} in a single frame. Let the image feel as calm as the weather you carried last.`;
  }

  return `${base} Make the photograph feel like a secret you can return to.`;
}

const CAT_ICON: Record<CreativityCategory, ComponentType<{ className?: string }>> = {
  photography: ImageIcon,
  painting: Palette,
  dance: Wind,
  writing: Feather,
  music: Music2,
  film: Film,
  "midnight-walks": Moon,
  "memory-room": BookOpen,
  soundscape: Volume2,
};

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = (CREATIVITY as any)[category as CreativityCategory] as typeof CREATIVITY.photography | undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completed, finish } = useCreativity();
  const { logs } = useMoodLogs();
  const { journals } = useJournals();

  const [mood, setMood] = useState<MoodKey>("luminous");
  const [prompt, setPrompt] = useState<string>(() =>
    pickPrompt((category as CreativityCategory) ?? "writing", new Date().toISOString().slice(0, 10))
  );
  const [content, setContent] = useState("");
  const [reflection, setReflection] = useState("");
  const [done, setDone] = useState(false);
  const [energy, setEnergy] = useState(3);
  const [chosenColor, setChosenColor] = useState<string | null>(null);
  const [ritualReady, setRitualReady] = useState(false);
  const [entryLine, setEntryLine] = useState(0);
  const [ambientReady, setAmbientReady] = useState(false);
  const [mission, setMission] = useState("");
  const [companionNote, setCompanionNote] = useState("The studio is listening to your breath.");

  const visuals = useEmotionVisuals(700);
  const isPhotography = cat?.key === "photography";
  const studioOpen = !isPhotography || (ritualReady && ambientReady);
  const promptSource = isPhotography && mission ? mission : prompt;

  const moodLabel = MOODS.find((m) => m.key === mood)?.label.toLowerCase() ?? "soft";

  useEffect(() => {
    const lastMood = logs[0]?.mood as MoodKey | undefined;
    if (lastMood && MOODS.some((m) => m.key === lastMood)) {
      setMood(lastMood);
    }
  }, [logs]);

  useEffect(() => {
    if (!isPhotography) return;

    setEntryLine(0);
    setAmbientReady(false);
    setMission("");
    setCompanionNote("The studio is listening to your breath.");

    const isLate = new Date().getHours() >= 20 || new Date().getHours() < 5;
    const memoryCueText = journals.length > 0
      ? `Three nights ago you wrote: "${journals[0].content.trim().split("\n")[0].slice(0, 90)}"`
      : logs.length > 0
        ? `Your last mood was ${logs[0].mood}. The studio listens to that weather.`
        : "This quiet room is built to remember what you bring tonight.";

    const timers: ReturnType<typeof setTimeout>[] = [];
    PHOTOGRAPHY_ENTRY_LINES.forEach((_, index) => {
      timers.push(setTimeout(() => setEntryLine(index + 1), 1200 + index * 1200));
    });
    timers.push(setTimeout(() => {
      setAmbientReady(true);
      setMission(generatePhotographyMission(mood, isLate, memoryCueText));
      setCompanionNote("A slow light is ready. When you are ready, let yourself frame it.");
    }, 4200));

    return () => timers.forEach(clearTimeout);
  }, [isPhotography, journals, logs, mood]);

  const myCompleted = useMemo(
    () => completed.filter((c) => c.category === (category as CreativityCategory)).slice(0, 6),
    [completed, category]
  );

  const inspiration = useMemo(() => {
    const list = cat ? INSPIRATION[cat.key] : [];
    return [...list].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [cat]);

  const poetic = useMemo(() => {
    const list = cat ? POETICS[cat.key] : [];
    return list[Math.floor(Math.random() * list.length)] ?? "";
  }, [cat]);

  const memoryCue = useMemo(() => {
    if (journals.length > 0) {
      const firstLine = journals[0].content.trim().split("\n")[0].slice(0, 90);
      return `Three nights ago you wrote: "${firstLine}"`;
    }
    if (logs.length > 0) {
      return `Your last mood was ${logs[0].mood}. The studio listens to that weather.`;
    }
    return "This quiet room is built to remember what you bring tonight.";
  }, [journals, logs]);

  useEffect(() => {
    setDone(false);
    setContent("");
    setReflection("");
    setChosenColor(null);
    setRitualReady(false);
  }, [category]);

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-muted-foreground">This studio is still waking. Return later to explore its light.</p>
        <Link to="/creativity" className="mt-4 inline-block text-primary-glow underline">Back to creativity</Link>
      </div>
    );
  }

  const Icon = CAT_ICON[cat.key];
  const promptLabel = `${cat.label} invitation`;

  const save = async () => {
    try {
      await finish({
        category: cat.key,
        prompt,
        content: content || null,
        reflection: reflection || null,
        photo_url: null,
      });
      setDone(true);
      toast.success("Held in your memories");
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't save");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="glass-strong relative overflow-hidden rounded-[2rem] p-6 md:p-10"
        style={{
          background: cat.gradient,
          opacity: 0.92 + visuals.opacity * 0.08,
        }}
      >
        <Particles count={26} />
        <motion.div
          aria-hidden
          className="absolute -left-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, ${cat.tint} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <Link to="/creativity"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs backdrop-blur hover:border-primary/40">
              <ArrowLeft className="h-3.5 w-3.5" /> Studios
            </Link>
            <span className="rounded-full border border-white/15 bg-background/30 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
              studio ritual
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-background/30 px-3 py-2 text-sm text-primary-glow backdrop-blur">
                <Icon className="h-4 w-4" /> {cat.label}
              </div>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">{cat.tagline}</h1>
              <p className="mt-4 max-w-2xl text-sm italic text-muted-foreground md:text-base">{poetic}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-background/20 p-5 text-sm text-muted-foreground backdrop-blur">
              The studio listens to the light. Your companion matches it with quiet presence.
              <div className="mt-3 rounded-2xl bg-background/40 p-3 text-xs leading-tight text-slate-200">
                {`Tonight the studio listens to ${moodLabel}. Let it feel slow, intimate and unforced.`}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="glass relative overflow-hidden rounded-3xl p-6"
        >
          <Sparkles className="absolute right-5 top-5 h-4 w-4 text-primary-glow/60" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{promptLabel}</p>

          <AnimatePresence mode="wait">
            <motion.h2 key={promptSource + mood}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-2xl leading-snug md:text-3xl"
            >
              {promptSource}
            </motion.h2>
          </AnimatePresence>

          <p className="mt-3 text-xs text-muted-foreground">
            Tuned to your <span className="text-foreground">{MOODS.find((m) => m.key === mood)?.label.toLowerCase()}</span> weather.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setPrompt(pickPrompt(cat.key, crypto.randomUUID()))}>
              <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Another invitation
            </Button>
            <Button variant={ritualReady ? "secondary" : "default"} size="sm" onClick={() => setRitualReady(true)}>
              {ritualReady ? "Studio is ready" : "Light the candle"}
            </Button>
          </div>

          <div className="mt-5 rounded-3xl border border-border/50 bg-background/40 p-4 text-sm text-muted-foreground backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Soft ritual</p>
            <p className="mt-2 leading-relaxed">
              {ritualReady
                ? ambientReady
                  ? "Lean into the calm. The studio is open. Move with a single careful gesture."
                  : "The room is warming. Wait for the air to settle before you reach for the frame."
                : "Before the studio opens, take one slow breath and invite yourself in. This place is for feeling, not doing."}
            </p>
          </div>

          {isPhotography && (
            <div className="mt-5 rounded-3xl border border-border/40 bg-background/30 p-4 text-sm text-muted-foreground backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Cinematic entry</p>
              <div className="mt-3 space-y-3">
                {PHOTOGRAPHY_ENTRY_LINES.slice(0, entryLine).map((line, index) => (
                  <motion.p key={index}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.12 }}
                    className="text-sm leading-relaxed"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-300">
                {ambientReady
                  ? "Ambient layer engaged. The room has settled into a slow, candlelit rhythm."
                  : "A soft ambient current is gathering. Hold space until the light feels right."}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{companionNote}</p>
            </div>
          )}
        </motion.section>

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
          <div className="mt-6 rounded-3xl border border-border/50 bg-background/40 p-4 text-sm text-muted-foreground backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Memory cue</p>
            <p className="mt-2 leading-relaxed text-slate-200">{memoryCue}</p>
          </div>
        </section>
      </div>

      {!done && (
        <section className="mt-6 grid gap-6">
          {cat.key === "photography" && !studioOpen && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Photography ritual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Imagine a small scene. The studio is still waking. Hold your gaze and let one quiet detail come forward.
              </p>
              <div className="mt-5 rounded-3xl border border-border/30 bg-background/20 p-4 text-sm text-slate-200">
                {mission || "A quiet frame is waiting. Let the light settle before you take the first note."}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">This is a memory-aware ritual. When the studio opens, the frame will become clearer.</div>
            </div>
          )}

          {cat.key === "photography" && studioOpen && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Photography ritual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Notice the light, the shadow and the feeling you would keep if you could frame it forever.
              </p>
              <div className="mt-5 rounded-3xl border border-border/30 bg-background/20 p-4 text-sm text-slate-200">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Your light mission</p>
                <p className="mt-2 leading-relaxed">{mission || "Capture the quiet warmth in a single frame."}</p>
              </div>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the one frame you would hold tonight..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "painting" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Painting ritual</p>
              <h3 className="mt-2 font-display text-xl">{EMOTION_PALETTES[mood].name}</h3>
              <p className="mt-1 text-sm italic text-muted-foreground">"{EMOTION_PALETTES[mood].whisper}"</p>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {EMOTION_PALETTES[mood].colors.map((c) => {
                  const active = chosenColor === c;
                  return (
                    <button key={c} onClick={() => setChosenColor(c)}
                      className={`relative aspect-square rounded-2xl ring-1 transition ${active ? "ring-primary-glow" : "ring-white/10"}`}
                      style={{ background: c, boxShadow: active ? `0 0 40px ${c}` : `0 0 18px ${c}80` }}>
                      <span className="absolute bottom-1 left-1 right-1 truncate rounded-md bg-black/40 px-1 py-0.5 text-[10px] text-white/90 backdrop-blur">
                        {c}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Name the color, then name the feeling it holds..."
                className="mt-5 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "dance" && (
            <div className="glass relative overflow-hidden rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Dance ritual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Set the pace with your breath. Move with one careful impulse until the body quiets and the room listens.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">still</span>
                <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full accent-primary" />
                <span className="text-xs text-muted-foreground">wild</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {energy <= 2 ? "Soft and held." : energy === 3 ? "A steady, gentle pulse." : "Let the movement open."}
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Name the gesture, the rhythm, or the emotion of the movement..."
                className="mt-5 min-h-[140px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "writing" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Writing ritual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Let one quiet line arrive. The page is a place to hold the feeling without making it perform.
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Write the first honest line you would whisper to yourself..."
                className="mt-4 min-h-[220px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "music" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Music ritual</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Listen first. Then name the sound, the memory, or the feeling it opens in you.
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the first sound you let the studio hold..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "film" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Film studio</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Observe one moment as if it were a single scene. Give it a title, a tone, and a quiet first line.
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Write the opening shot of this memory scene..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "midnight-walks" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Midnight walk</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Walk the night without hurry. Notice one detail that feels like a hidden poem.
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the lantern, the pavement, or the quiet sound that stayed with you..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "memory-room" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Memory room</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This room holds a quiet detail from your past. Let one remembered moment arrive without judgment.
              </p>
              <div className="mt-3 rounded-2xl bg-background/20 p-3 text-sm text-slate-200">
                {memoryCue}
              </div>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Recall a small moment and hold it here in words..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          {cat.key === "soundscape" && (
            <div className="glass rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Soundscape</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Let the room become a layered sound field. Describe the three quietest sounds you can find.
              </p>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the soft, the present, and the echo..."
                className="mt-4 min-h-[180px] rounded-2xl border-border/60 bg-background/30 backdrop-blur" />
            </div>
          )}

          <div className="glass rounded-3xl p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">A small reflection</p>
            <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)}
              placeholder="What did the ritual open in you?"
              className="mt-3 min-h-[120px] rounded-2xl border-border/60 bg-background/40 backdrop-blur" />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="text-xs text-muted-foreground">Saved to your emotional memories.</div>
              <div className="ml-auto">
                <Button onClick={save}><Check className="mr-2 h-4 w-4" /> Save to memories</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {done && (
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-8 glass-strong relative overflow-hidden rounded-[2rem] p-10 text-center"
        >
          <div className="absolute inset-0 -z-10 opacity-90" style={{ background: cat.gradient }} />
          <Particles count={24} />
          <p className="text-xs uppercase tracking-[0.25em] text-primary-glow">Held</p>
          <h2 className="mt-3 font-display text-3xl">Gently held.</h2>
          <p className="mt-2 text-sm italic text-muted-foreground">"{poetic}"</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={() => { setDone(false); setPrompt(pickPrompt(cat.key, crypto.randomUUID())); }}>Try another invitation</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/memories" })}>See memories</Button>
          </div>
        </motion.section>
      )}

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
