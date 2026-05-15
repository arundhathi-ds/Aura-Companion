import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { EXPERIENCES, CATEGORY_META, type ExperienceCategory } from "@/data/experiences";
import { recommendExperiences, emotionalWeather } from "@/lib/experience/engine";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { useSavedExperiences } from "@/lib/experience/use-saved-experiences";
import { useCompletedExperiences } from "@/lib/experience/use-completed";
import { useMoodLogs } from "@/lib/mood/use-mood-logs";
import { Particles } from "@/components/companion/Particles";

export const Route = createFileRoute("/_app/experiences")({
  component: ExperiencesPage,
  head: () => ({
    meta: [
      { title: "Experiences — Life Companion" },
      { name: "description", content: "Personalized real-life experiences chosen for your emotional weather." },
    ],
  }),
});

const FILTERS: Array<{ key: "all" | ExperienceCategory; label: string }> = [
  { key: "all", label: "For you" },
  { key: "creative", label: "Creative" },
  { key: "emotional", label: "Emotional" },
  { key: "social", label: "Social" },
  { key: "adventure", label: "Adventure" },
];

function ExperiencesPage() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const { savedSlugs, toggleSave } = useSavedExperiences();
  const { completedSlugs } = useCompletedExperiences();
  const { logs } = useMoodLogs();
  const [filter, setFilter] = useState<typeof FILTERS[number]["key"]>("all");

  const recommended = useMemo(
    () => recommendExperiences({
      mood: profile?.current_mood,
      focusAreas: profile?.focus_areas,
      intentions: profile?.intentions,
      socialComfort: 1,
      energy: 3,
      savedSlugs: Array.from(savedSlugs),
      completedSlugs: Array.from(completedSlugs),
      recentMoods: logs.map((l) => l.mood),
    }, 12),
    [profile?.current_mood, profile?.focus_areas, profile?.intentions, savedSlugs, completedSlugs, logs]
  );

  const list = useMemo(() => {
    if (filter === "all") return recommended;
    return EXPERIENCES.filter((e) => e.category === filter);
  }, [filter, recommended]);

  const weather = emotionalWeather(profile?.current_mood);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <Particles count={18} />
        <motion.div aria-hidden className="absolute -top-32 -right-20 h-80 w-80 rounded-full"
          style={{ background: `radial-gradient(circle, ${weather.tint}, transparent 65%)`, filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Experiences chosen for your weather</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
            Step into <span className="text-aurora">{weather.label.toLowerCase()}</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Small, real-life moments — picked for the way you feel right now. Save the ones that pull at you;
            they'll wait quietly in your memories.
          </p>
        </div>
      </motion.header>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                active
                  ? "border-primary bg-primary/20 text-foreground shadow-[0_0_20px] shadow-primary/40"
                  : "border-border bg-background/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}>{f.label}</button>
          );
        })}
      </div>

      {/* Category strip */}
      {filter !== "all" && (
        <p className="mt-4 text-sm text-muted-foreground">{CATEGORY_META[filter as ExperienceCategory].tagline}</p>
      )}

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((exp, i) => (
          <ExperienceCard
            key={exp.slug} experience={exp} index={i}
            saved={savedSlugs.has(exp.slug)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>
    </div>
  );
}
