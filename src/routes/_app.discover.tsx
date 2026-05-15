import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MapPin, CloudSun } from "lucide-react";
import { fetchNearbyPlaces, KIND_META, type PlaceKind } from "@/data/places";
import { Particles } from "@/components/companion/Particles";

export const Route = createFileRoute("/_app/discover")({
  component: DiscoverPage,
  head: () => ({
    meta: [
      { title: "Discover — Life Companion" },
      { name: "description", content: "Meaningful nearby places — cafés, bookstores, hidden parks — for your inner weather." },
    ],
  }),
});

const KINDS: Array<"all" | PlaceKind> = ["all", "cafe", "bookstore", "library", "park", "beach", "gallery", "workshop", "hidden"];

function DiscoverPage() {
  const [kind, setKind] = useState<typeof KINDS[number]>("all");
  // TODO: real geolocation + weather here. For now, the catalog responds to the same shape.
  const { data: places = [] } = useQuery({
    queryKey: ["places", kind],
    queryFn: () => fetchNearbyPlaces({ kind: kind === "all" ? undefined : kind }),
  });
  const list = useMemo(
    () => kind === "all" ? places : places.filter((p) => p.kind === kind),
    [places, kind]
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <Particles count={16} />
        <motion.div aria-hidden className="absolute -top-32 -left-20 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.15 200 / 0.6), transparent 65%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Discover</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">
            Places that quietly <span className="text-aurora">make you feel</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            A living map of meaningful corners near you. Soon, your companion will weigh weather, hour and your mood
            to suggest the right one.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 backdrop-blur">
              <MapPin className="h-3 w-3 text-primary-glow" /> Nearby (preview catalog)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 backdrop-blur">
              <CloudSun className="h-3 w-3 text-primary-glow" /> Weather-aware soon
            </span>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {KINDS.map((k) => {
          const active = kind === k;
          const label = k === "all" ? "All places" : KIND_META[k].label;
          return (
            <button key={k} onClick={() => setKind(k)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                active
                  ? "border-primary bg-primary/20 text-foreground shadow-[0_0_20px] shadow-primary/40"
                  : "border-border bg-background/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}>{label}</button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.5 }} whileHover={{ y: -4 }}
            className="glass overflow-hidden rounded-3xl p-5 transition hover:border-primary/40"
          >
            <div className="relative h-28 w-full overflow-hidden rounded-2xl" style={{ background: p.gradient }}>
              <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-background/40 text-base backdrop-blur">
                {KIND_META[p.kind].icon}
              </div>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-primary-glow">{p.vibe}</p>
            <h3 className="mt-1 font-display text-xl">{p.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {p.distanceLabel}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
