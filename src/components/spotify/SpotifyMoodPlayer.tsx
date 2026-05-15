/**
 * SpotifyMoodPlayer.tsx
 * Glassmorphism card showing curated Spotify playlists matched to the user's mood.
 * Fully static — no API key or server call needed.
 */

import { motion } from "framer-motion";
import { Music2, ExternalLink } from "lucide-react";
import { getPlaylistsForMood, getMoodLabel, type CuratedPlaylist } from "@/lib/spotify/curated-playlists";

type Props = {
  mood?: string | null;
};

function PlaylistRow({ playlist, index }: { playlist: CuratedPlaylist; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <a
        href={playlist.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white/5 p-3 transition hover:border-white/10 hover:bg-white/[0.08]"
      >
        {/* Gradient cover art tile */}
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
          style={{ background: playlist.gradient }}
        >
          <Music2 className="h-5 w-5 text-white/70" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium group-hover:text-foreground">
            {playlist.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {playlist.trackCount} tracks
          </p>
        </div>

        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
      </a>
    </motion.li>
  );
}

export function SpotifyMoodPlayer({ mood }: Props) {
  const playlists = getPlaylistsForMood(mood);
  const label = getMoodLabel(mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="glass rounded-3xl p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
          style={{
            background: "color-mix(in oklab, oklch(0.75 0.2 140) 22%, transparent)",
            boxShadow: "0 0 20px color-mix(in oklab, oklch(0.75 0.2 140) 50%, transparent)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Music2
            className="h-4 w-4"
            style={{ color: "oklch(0.75 0.2 140)" }}
          />
        </motion.span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Sounds for your vibe
          </p>
          <p className="text-sm font-medium">{label}</p>
        </div>
      </div>

      {/* Playlist list */}
      <ul className="mt-4 space-y-2">
        {playlists.map((p, i) => (
          <PlaylistRow key={p.id} playlist={p} index={i} />
        ))}
      </ul>

      <p className="mt-3 text-[10px] text-muted-foreground/60">
        Opens in Spotify · updates with your mood
      </p>
    </motion.div>
  );
}
