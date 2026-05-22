/**
 * SmartMusicPlayer.tsx
 * Conversational music discovery with 4 steps: Intent -> Weather -> Language -> Shuffled Results.
 * Supports 10 languages with rotating pools and emotional context weighting.
 * Integrates MusicMemory for repeat prevention and artist fatigue detection.
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, ExternalLink, RotateCcw, ChevronRight, Globe, Shuffle } from "lucide-react";
import {
  INTENT_OPTIONS,
  WEATHER_OPTIONS,
  LANGUAGE_OPTIONS,
  getVibeHeadline,
  getDynamicSongs,
  type SongIntent,
  type WeatherVibe,
  type SongLanguage,
  type Song,
} from "@/lib/spotify/song-recommendations";
import { getRecommendations } from "@/lib/spotify/recommendation-engine";
import { findCategoryByKey, pickCategoryForIntentWeather } from "@/lib/spotify/categories";
import { useAtmosphere } from "@/components/atmosphere/AtmosphereProvider";
import { MusicMemory } from "@/lib/spotify/music-memory";

type Step = "intent" | "weather" | "language" | "results";

function OptionChip({
  label,
  selected,
  onClick,
  emoji,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-sm transition ${
        selected
          ? "border-primary/70 bg-primary/20 text-foreground shadow-[0_0_16px] shadow-primary/30"
          : "border-border bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
      }`}
    >
      {emoji && <span className="text-base leading-none">{emoji}</span>}
      {label}
    </motion.button>
  );
}

function SongCard({ song, index }: { song: Song; index: number }) {
  return (
    <motion.a
      href={song.searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/10 hover:bg-white/[0.08]"
    >
      <div
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white/80"
        style={{ background: `color-mix(in oklab, ${song.color} 40%, oklch(0.2 0.05 280))` }}
      >
        <Music2 className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium group-hover:text-foreground">{song.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{song.artist}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
    </motion.a>
  );
}

interface SmartMusicPlayerProps {
  mood?: string | null;
}

export function SmartMusicPlayer({ mood }: SmartMusicPlayerProps) {
  const [step, setStep] = useState<Step>("intent");
  const [intent, setIntent] = useState<SongIntent | null>(null);
  const [weather, setWeather] = useState<WeatherVibe | null>(null);
  const [language, setLanguage] = useState<SongLanguage | null>(null);
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { setAtmosphere } = useAtmosphere();

  const reset = useCallback(() => {
    setStep("intent");
    setIntent(null);
    setWeather(null);
    setLanguage(null);
  }, []);

  const generateResults = useCallback(
    (l: SongLanguage) => {
      if (!intent || !weather) return;
      setSongs([]);
      setLoading(true);
      (async () => {
        try {
          const res = await getRecommendations({
            data: {
              intent,
              weather,
              language: l,
              mood: mood ?? undefined,
              limit: 14,
            },
          });
          const categoryKey = pickCategoryForIntentWeather(intent, weather as string);
          const profile = findCategoryByKey(categoryKey);
          try {
            setAtmosphere(categoryKey);
          } catch {
            // atmosphere update is non-critical
          }

          const mapped: Song[] = (res?.tracks ?? []).map(
            (t: { name: string; artists: string[]; spotifyUrl: string }) => ({
              title: t.name,
              artist: (t.artists ?? []).join(", "),
              searchUrl: t.spotifyUrl,
              color: profile?.visual?.tint ?? "oklch(0.75 0.2 140)",
              language: l,
            }),
          );

          const fresh = mapped.filter((song) => !MusicMemory.isRecentlyShown(song.searchUrl));
          const finalSongs = fresh.length >= 6 ? fresh.slice(0, 10) : mapped.slice(0, 10);

          finalSongs.forEach((song) => {
            MusicMemory.recordTrack(song.searchUrl, song.title, categoryKey, song.artist);
          });

          setSongs(finalSongs);
          setStep("results");
        } catch {
          const results = getDynamicSongs(intent, l, weather);
          setSongs(results);
          setStep("results");
        } finally {
          setLoading(false);
        }
      })();
    },
    [intent, weather, mood, setAtmosphere],
  );

  const shuffleResults = useCallback(() => {
    if (!intent || !weather || !language) return;
    generateResults(language);
  }, [intent, weather, language, generateResults]);

  const headline = useMemo(
    () => (intent && weather && language ? getVibeHeadline(intent, weather, language) : ""),
    [intent, weather, language],
  );

  const memoryStats = useMemo(() => {
    try {
      return MusicMemory.getStats();
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs.length]);

  if (!open) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass rounded-3xl p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
              style={{
                background: "color-mix(in oklab, oklch(0.75 0.2 140) 22%, transparent)",
                boxShadow: "0 0 20px color-mix(in oklab, oklch(0.75 0.2 140) 50%, transparent)",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Music2 className="h-4 w-4" style={{ color: "oklch(0.75 0.2 140)" }} />
            </motion.span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Global Harmonies
              </p>
              <p className="text-sm font-medium">Multi-language music discovery</p>
              {memoryStats && memoryStats.recentTracksInWindow > 0 && (
                <p className="text-[10px] text-muted-foreground/60">
                  {memoryStats.recentTracksInWindow} tracks explored · {memoryStats.uniqueArtists}{" "}
                  artists
                </p>
              )}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-xs text-primary-glow transition hover:bg-primary/25"
          >
            Find Songs <ChevronRight className="h-3 w-3" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" style={{ color: "oklch(0.75 0.2 140)" }} />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Discover Vibes
          </p>
        </div>
        <button onClick={reset} className="text-muted-foreground transition hover:text-foreground">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === "intent" && (
          <motion.div
            key="intent"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="mt-4 text-sm font-medium">What's the goal?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTENT_OPTIONS.map((o) => (
                <OptionChip
                  key={o.key}
                  emoji={o.emoji}
                  label={o.label}
                  selected={intent === o.key}
                  onClick={() => {
                    setIntent(o.key);
                    setStep("weather");
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "weather" && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="mt-4 text-sm font-medium">How's the weather?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {WEATHER_OPTIONS.map((o) => (
                <OptionChip
                  key={o.key}
                  emoji={o.emoji}
                  label={o.label}
                  selected={weather === o.key}
                  onClick={() => {
                    setWeather(o.key);
                    setStep("language");
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "language" && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="mt-4 text-sm font-medium">Preferred language?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((o) => (
                <OptionChip
                  key={o.key}
                  label={o.label}
                  selected={language === o.key}
                  onClick={() => {
                    setLanguage(o.key);
                    generateResults(o.key);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {headline}
            </p>
            {loading ? (
              <div className="mt-4 flex items-center justify-center py-8">
                <motion.div
                  className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <>
                <ul className="mt-3 space-y-2">
                  {songs.map((song, i) => (
                    <SongCard key={`${song.title}-${i}`} song={song} index={i} />
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={shuffleResults}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition"
                  >
                    <Shuffle className="h-3 w-3" /> Shuffle fresh tracks
                  </button>
                  <button
                    onClick={reset}
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition"
                  >
                    New vibe
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
