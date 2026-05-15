import { motion } from "framer-motion";
import { Bookmark, Clock, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Experience } from "@/data/experiences";
import { CATEGORY_META } from "@/data/experiences";

export function ExperienceCard({
  experience, saved, onToggleSave, index = 0,
}: {
  experience: Experience;
  saved?: boolean;
  onToggleSave?: (slug: string) => void;
  index?: number;
}) {
  const meta = CATEGORY_META[experience.category];
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 transition hover:border-primary/40"
      style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 30px 60px -40px oklch(0 0 0 / 0.7)" }}
    >
      <Link
        to="/experiences/$slug"
        params={{ slug: experience.slug }}
        aria-label={`Open ${experience.title}`}
        className="absolute inset-0 z-[1]"
      />
      {/* image area */}
      <div className="relative h-32 w-full overflow-hidden rounded-2xl" style={{ background: experience.gradient }}>
        <motion.div
          aria-hidden className="absolute -inset-6 opacity-70"
          style={{ background: `radial-gradient(circle at 30% 30%, ${meta.tint}, transparent 65%)`, filter: "blur(28px)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-background/40 px-2.5 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.tint, boxShadow: `0 0 8px ${meta.tint}` }} />
          {meta.label}
        </div>
        {onToggleSave && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(experience.slug); }}
            aria-label={saved ? "Remove" : "Save"}
            className={`absolute right-3 top-3 z-[2] grid h-9 w-9 place-items-center rounded-full border backdrop-blur-xl transition ${
              saved
                ? "border-primary/60 bg-primary/25 text-primary-glow"
                : "border-white/15 bg-background/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </motion.button>
        )}
      </div>

      <div className="relative z-[1] mt-4 flex flex-1 flex-col pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary-glow">{experience.vibe}</p>
        <h3 className="mt-1.5 font-display text-xl leading-snug">{experience.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{experience.description}</p>

        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {experience.durationMin} min</span>
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}
                className="ml-0.5 h-1 w-2 rounded-full"
                style={{ background: i < experience.energy ? "oklch(0.85 0.18 320)" : "oklch(1 0 0 / 0.12)" }} />
            ))}
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest">
            {experience.social === 0 ? "Solo" : experience.social === 1 ? "Quiet public" : "Social"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
