import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Camera, Music, PenLine, Palette as PaletteIcon, Activity } from "lucide-react";
import { CREATIVITY_LIST } from "@/data/creativity";
import { Particles } from "@/components/companion/Particles";
import { useCreativity } from "@/lib/creativity/use-creativity";

export const Route = createFileRoute("/_app/creativity")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Creativity — Life Companion" },
      { name: "description", content: "Five quiet studios for words, light, color, sound and movement." },
    ],
  }),
});

const ICONS = {
  photography: Camera, painting: PaletteIcon, dance: Activity, writing: PenLine, music: Music,
} as const;

function Page() {
  const { completed } = useCreativity();
  const counts = completed.reduce<Record<string, number>>((m, c) => {
    m[c.category] = (m[c.category] ?? 0) + 1;
    return m;
  }, {});

  return (
    <div className="mx-auto max-w-7xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <Particles count={16} />
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Five quiet studios</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
          Make something <span className="text-aurora">small and alive</span>.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Each studio gives you a single, soft prompt. No skill needed. Just begin.
        </p>
      </motion.header>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CREATIVITY_LIST.map((c, i) => {
          const Icon = ICONS[c.key];
          return (
            <motion.div key={c.key}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }} whileHover={{ y: -4 }}
              className="glass relative overflow-hidden rounded-3xl"
            >
              <Link to="/creativity/$category" params={{ category: c.key }} className="block">
                <div className="relative h-32 w-full" style={{ background: c.gradient }}>
                  <motion.div aria-hidden className="absolute -inset-6 opacity-70"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${c.tint}, transparent 65%)`, filter: "blur(28px)" }}
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-background/40 px-2.5 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                    <Icon className="h-3 w-3" style={{ color: c.tint }} /> {c.label}
                  </div>
                  {counts[c.key] ? (
                    <div className="absolute right-3 top-3 rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 text-[10px] uppercase tracking-widest text-primary-glow backdrop-blur">
                      {counts[c.key]} done
                    </div>
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl">{c.label}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.tagline}</p>
                  <p className="mt-4 text-xs text-primary-glow">Open studio →</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
