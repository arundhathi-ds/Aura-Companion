/**
 * CategoryBrowser.tsx
 * Interactive emotional atmosphere and music category explorer.
 * Allows users to browse, select, and discover music from expanded category system.
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Play, ChevronRight, Sparkles, X, ExternalLink } from "lucide-react";

import { useServerFn } from "@tanstack/react-start";
import { CATEGORIES, findCategoryByKey } from "@/lib/spotify/categories";
import { getRecommendations } from "@/lib/spotify/recommendation-engine";
import { useAtmosphere } from "@/components/atmosphere/AtmosphereProvider";
import { MusicMemory } from "@/lib/spotify/music-memory";

interface Track {
  id: string;
  name: string;
  artists: string[];
  spotifyUrl: string;
  previewUrl?: string | null;
  albumImage?: string | null;
}

type CategoryGroupKey = "focus" | "emotional" | "atmospheric" | "energy" | "social" | "cinematic";

interface CategoryGroup {
  key: CategoryGroupKey;
  label: string;
  icon: string;
  color: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  { key: "focus", label: "Focus & Productivity", icon: "🎯", color: "from-blue-500" },
  { key: "emotional", label: "Emotional", icon: "💫", color: "from-purple-500" },
  { key: "atmospheric", label: "Atmospheric", icon: "🌍", color: "from-cyan-500" },
  { key: "energy", label: "Energy", icon: "⚡", color: "from-orange-500" },
  { key: "social", label: "Social", icon: "👥", color: "from-pink-500" },
  { key: "cinematic", label: "Cinematic", icon: "🎬", color: "from-indigo-500" },
];

const getCategoryGroup = (categoryKey: string): CategoryGroupKey | null => {
  const focusCategories = ["deep-focus", "study-flow", "coding-night", "quiet-concentration"];
  const emotionalCategories = [
    "healing",
    "nostalgia",
    "overthinking-hours",
    "lonely-night",
    "quiet-curiosity",
  ];
  const atmosphericCategories = [
    "rainy-window",
    "neon-city",
    "space-drift",
    "coffee-shop",
    "midnight-train",
    "ocean-waves",
  ];
  const energyCategories = ["hyper-mode", "gym-beast", "late-night-energy", "morning-momentum"];
  const socialCategories = ["road-trip", "house-party", "chill-with-friends", "romantic-evening"];
  const cinematicCategories = [
    "movie-ending",
    "main-character-walk",
    "cyberpunk-night",
    "slow-motion-memories",
  ];

  if (focusCategories.includes(categoryKey)) return "focus";
  if (emotionalCategories.includes(categoryKey)) return "emotional";
  if (atmosphericCategories.includes(categoryKey)) return "atmospheric";
  if (energyCategories.includes(categoryKey)) return "energy";
  if (socialCategories.includes(categoryKey)) return "social";
  if (cinematicCategories.includes(categoryKey)) return "cinematic";

  return null;
};

function TrackCard({
  track,
  index,
  categoryColor,
}: {
  track: Track;
  index: number;
  categoryColor: string;
}) {
  return (
    <motion.a
      href={track.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-sm transition hover:border-white/10 hover:bg-white/[0.06]"
    >
      {track.albumImage && (
        <img
          src={track.albumImage}
          alt={track.name}
          className="h-12 w-12 rounded-lg object-cover shadow-lg"
        />
      )}
      {!track.albumImage && (
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white/70"
          style={{
            background: `color-mix(in oklab, ${categoryColor} 30%, oklch(0.2 0.05 280))`,
            boxShadow: `0 0 16px ${categoryColor}40`,
          }}
        >
          <Music2 className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium group-hover:text-white">{track.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {track.artists[0] || "Unknown"}
        </p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
    </motion.a>
  );
}

function CategoryCard({
  category,
  groupColor,
  isSelected,
  onClick,
}: {
  category: (typeof CATEGORIES)[0];
  groupColor: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex flex-col gap-2 rounded-2xl p-4 transition ${
        isSelected
          ? "border border-white/30 bg-white/10 shadow-lg shadow-white/10"
          : "border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="selectedBorder"
          className="absolute inset-0 rounded-2xl border border-white/40"
          initial={false}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative z-10">
        <p className="text-sm font-medium text-white">{category.label}</p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-1">
          {category.emotion || category.description || "Explore this mood"}
        </p>
      </div>

      <div className="relative z-10 h-1 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: groupColor }}
          layoutId={`progress-${category.key}`}
          initial={false}
          animate={{ scaleX: isSelected ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  );
}

interface CategoryBrowserProps {
  mood?: string | null;
}

export function CategoryBrowser({ mood }: CategoryBrowserProps) {
  const [activeGroup, setActiveGroup] = useState<CategoryGroupKey>("atmospheric");
  const [selectedCategory, setSelectedCategory] = useState<string>("rainy-window");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setAtmosphere } = useAtmosphere();
  const recommend = useServerFn(getRecommendations);

  const filteredCategories = CATEGORIES.filter((c) => getCategoryGroup(c.key) === activeGroup);
  const group = CATEGORY_GROUPS.find((g) => g.key === activeGroup);
  const selectedCategoryProfile = findCategoryByKey(selectedCategory);

  const loadTracksForCategory = useCallback(
    async (categoryKey: string) => {
      setLoading(true);
      try {
        const res = await recommend({
          data: {
            intent: categoryKey,
            weather: undefined,
            mood: mood ?? undefined,
            limit: 18,
          },
        });
        const mappedTracks: Track[] = (res?.tracks ?? []).map(
          (t: {
            id: string;
            name: string;
            artists: string[];
            spotifyUrl: string;
            previewUrl?: string | null;
            albumImage?: string | null;
          }) => ({
            id: t.id,
            name: t.name,
            artists: t.artists,
            spotifyUrl: t.spotifyUrl,
            previewUrl: t.previewUrl,
            albumImage: t.albumImage,
          }),
        );

        const fresh = MusicMemory.filterOutRecent(mappedTracks);
        const finalTracks = fresh.length >= 8 ? fresh.slice(0, 15) : mappedTracks.slice(0, 15);

        setTracks(finalTracks);
        MusicMemory.recordTracks(finalTracks, categoryKey);
      } catch (e) {
        console.error("Failed to load tracks:", e);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    },
    [recommend, mood],
  );

  const handleCategorySelect = useCallback(
    async (categoryKey: string) => {
      setSelectedCategory(categoryKey);

      // Update atmosphere
      try {
        setAtmosphere(categoryKey);
      } catch (e) {
        console.warn("Failed to set atmosphere:", e);
      }

      await loadTracksForCategory(categoryKey);
    },
    [loadTracksForCategory, setAtmosphere],
  );

  if (!open) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={() => {
          setOpen(true);
          loadTracksForCategory(selectedCategory);
        }}
        className="glass rounded-3xl p-5 w-full text-left transition hover:bg-white/[0.08]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5 text-primary-glow" />
            </motion.span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Emotional Soundtracks
              </p>
              <p className="text-sm font-medium">Discover cinematic music atmospheres</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary-glow" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Emotional Soundtracks
            </p>
            <p className="text-sm font-semibold mt-1">{group?.label}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(false)}
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Group Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORY_GROUPS.map((g) => (
          <motion.button
            key={g.key}
            onClick={() => {
              setActiveGroup(g.key);
              const firstInGroup = CATEGORIES.find((c) => getCategoryGroup(c.key) === g.key);
              if (firstInGroup) handleCategorySelect(firstInGroup.key);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              activeGroup === g.key
                ? `border border-white/30 bg-white/10 shadow-lg shadow-white/10`
                : `border border-white/10 bg-white/5 hover:border-white/20`
            }`}
          >
            <span>{g.icon}</span>
            {g.label}
          </motion.button>
        ))}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              groupColor={group?.color || "from-blue-500"}
              isSelected={selectedCategory === category.key}
              onClick={() => handleCategorySelect(category.key)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Tracks Section */}
      <AnimatePresence mode="wait">
        {selectedCategoryProfile && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-3 pt-4 border-t border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {selectedCategoryProfile.label}
                </h3>
                {selectedCategoryProfile.companionLine && (
                  <p className="text-[11px] text-muted-foreground italic mt-1">
                    "{selectedCategoryProfile.companionLine}"
                  </p>
                )}
              </div>
              {!loading && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => loadTracksForCategory(selectedCategory)}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition"
                >
                  <Music2 className="h-4 w-4 text-primary-glow" />
                </motion.button>
              )}
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-6 w-6 border-2 border-white/20 border-t-white/50 rounded-full"
                  />
                </div>
              )}
              {!loading && tracks.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No tracks loaded. Click refresh to discover music.
                </p>
              )}
              {!loading &&
                tracks.map((track, i) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    index={i}
                    categoryColor={selectedCategoryProfile.visual?.tint || "oklch(0.75 0.2 140)"}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
