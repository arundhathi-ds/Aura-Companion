import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Bookmark, Check, BookOpen, Palette, Heart } from "lucide-react";
import { EXPERIENCES } from "@/data/experiences";
import { CREATIVITY } from "@/data/creativity";
import { useSavedExperiences } from "@/lib/experience/use-saved-experiences";
import { useCompletedExperiences } from "@/lib/experience/use-completed";
import { useJournals } from "@/lib/journals/use-journals";
import { useCreativity } from "@/lib/creativity/use-creativity";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { Particles } from "@/components/companion/Particles";

export const Route = createFileRoute("/_app/memories")({
  component: MemoriesPage,
  head: () => ({
    meta: [
      { title: "Memories — Life Companion" },
      { name: "description", content: "An emotional timeline of what you've felt, made, and held." },
    ],
  }),
});

type Item = {
  id: string;
  at: string;
  kind: "saved" | "completed" | "journal" | "creativity" | "mood";
  title: string;
  detail?: string;
  mood?: string | null;
  photo?: string | null;
  tint: string;
  href?: string;
};

function MemoriesPage() {
  const { savedList } = useSavedExperiences();
  const { completedList } = useCompletedExperiences();
  const { journals } = useJournals();
  const { completed: creativity } = useCreativity();
  const { logs } = useMoodLogs();

  const items: Item[] = useMemo(() => {
    const all: Item[] = [];

    for (const s of savedList) {
      const exp = EXPERIENCES.find((e) => e.slug === s.experience_slug);
      all.push({
        id: `s-${s.experience_slug}-${s.saved_at}`, at: s.saved_at, kind: "saved",
        title: exp?.title ?? s.experience_slug, detail: exp?.vibe ?? "Saved for later",
        tint: "oklch(0.85 0.18 320)",
        href: `/experiences/${s.experience_slug}`,
      });
    }
    for (const c of completedList) {
      const exp = EXPERIENCES.find((e) => e.slug === c.experience_slug);
      all.push({
        id: `c-${c.id}`, at: c.completed_at, kind: "completed",
        title: exp?.title ?? c.experience_slug,
        detail: c.note ?? exp?.vibe ?? "Completed",
        mood: c.mood_after ?? c.mood_before,
        photo: c.photo_url,
        tint: "oklch(0.82 0.15 200)",
        href: `/experiences/${c.experience_slug}`,
      });
    }
    for (const j of journals) {
      all.push({
        id: `j-${j.id}`, at: j.created_at, kind: "journal",
        title: j.ai_summary ?? j.content.slice(0, 80) + (j.content.length > 80 ? "…" : ""),
        detail: j.ai_emotion ?? j.prompt ?? undefined,
        mood: j.mood,
        tint: "oklch(0.78 0.16 295)",
      });
    }
    for (const k of creativity) {
      const meta = (CREATIVITY as any)[k.category];
      all.push({
        id: `k-${k.id}`, at: k.completed_at, kind: "creativity",
        title: `${meta?.label ?? "Creativity"}: ${k.prompt}`,
        detail: k.reflection ?? undefined,
        photo: k.photo_url,
        tint: meta?.tint ?? "oklch(0.85 0.18 320)",
        href: `/creativity/${k.category}`,
      });
    }
    for (const m of logs) {
      all.push({
        id: `m-${m.id}`, at: m.logged_at, kind: "mood",
        title: `Felt ${m.mood}`, mood: m.mood,
        tint: "oklch(0.82 0.18 50)",
      });
    }

    return all.sort((a, b) => b.at.localeCompare(a.at));
  }, [savedList, completedList, journals, creativity, logs]);

  /* group by date */
  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const d = new Date(it.at).toDateString();
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="mx-auto max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <Particles count={18} />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">An emotional timeline</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
          The <span className="text-aurora">constellation</span> you're building.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Every saved experience, every reflection, every small act — held together in one quiet sky.
        </p>
      </motion.header>

      {items.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-10 text-center">
          <p className="font-display text-xl">Your sky is still clear.</p>
          <p className="mt-2 text-sm text-muted-foreground">Save an experience, write a line, finish a small ritual — it will all live here.</p>
          <Link to="/experiences"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground glow-primary hover:opacity-90">
            Find a moment
          </Link>
        </div>
      ) : (
        <div className="relative mt-10">
          {/* vertical line */}
          <div aria-hidden className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-aurora/30 to-transparent md:left-6" />
          <div className="space-y-10">
            {grouped.map(([date, dayItems], gi) => (
              <motion.section key={date}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: gi * 0.04 }}
                className="relative"
              >
                <div className="flex items-center gap-3 pl-10 md:pl-14">
                  <span aria-hidden className="absolute left-2.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_14px_var(--primary)] md:left-[18px]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                </div>
                <ul className="mt-4 space-y-3 pl-10 md:pl-14">
                  {dayItems.map((it, i) => <TimelineRow key={it.id} item={it} index={i} />)}
                </ul>
              </motion.section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineRow({ item, index }: { item: Item; index: number }) {
  const Icon = iconFor(item.kind);
  const inner = (
    <motion.div
      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className="glass relative overflow-hidden rounded-2xl p-4 transition hover:border-primary/40"
    >
      <div aria-hidden className="absolute -left-12 top-1/2 h-px w-12 -translate-y-1/2 md:-left-14 md:w-14"
        style={{ background: `linear-gradient(90deg, transparent, ${item.tint})` }} />
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
          style={{ background: `color-mix(in oklab, ${item.tint} 22%, transparent)`, boxShadow: `0 0 16px color-mix(in oklab, ${item.tint} 60%, transparent)` }}>
          <Icon className="h-4 w-4" style={{ color: item.tint }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{labelFor(item.kind)}</span>
            {item.mood && <span className="capitalize">· {item.mood}</span>}
            <span className="ml-auto">{new Date(item.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm">{item.title}</p>
          {item.detail && <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">{item.detail}</p>}
          {item.photo && (
            <img src={item.photo} alt="" className="mt-3 h-32 w-full max-w-sm rounded-xl object-cover ring-1 ring-white/10" />
          )}
        </div>
      </div>
    </motion.div>
  );
  return <li>{item.href ? <Link to={item.href as any}>{inner}</Link> : inner}</li>;
}

function iconFor(k: Item["kind"]) {
  switch (k) {
    case "saved": return Bookmark;
    case "completed": return Check;
    case "journal": return BookOpen;
    case "creativity": return Palette;
    case "mood": return Heart;
  }
}
function labelFor(k: Item["kind"]) {
  switch (k) {
    case "saved": return "Saved";
    case "completed": return "Completed";
    case "journal": return "Journal";
    case "creativity": return "Creativity";
    case "mood": return "Mood";
  }
}
