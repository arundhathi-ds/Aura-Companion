/**
 * use-nudge-engine.ts
 * Triggers gentle browser notifications when the user hasn't checked in for 6+ hours.
 * Mounts globally in the app layout.
 *
 * No server or service worker required for v1 — purely client-side.
 */

import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const NUDGE_INTERVAL_MS = 30 * 60 * 1000;   // check every 30 min
const SILENCE_THRESHOLD_MS = 6 * 60 * 60 * 1000; // nudge if silent for 6h

const NUDGE_MESSAGES = [
  {
    title: "Your companion is wondering 🌙",
    body: "It's been a while. A quiet moment might be waiting for you.",
  },
  {
    title: "A soft check-in ✨",
    body: "How are you feeling right now? Your companion is here.",
  },
  {
    title: "Something gentle is ready 🌿",
    body: "There's an experience waiting for your kind of mood.",
  },
  {
    title: "A breath for you 🫧",
    body: "You haven't checked in today. Even a word is enough.",
  },
  {
    title: "The Orb is listening ◎",
    body: "Whenever you're ready — your space is still here.",
  },
  {
    title: "A small invitation 💫",
    body: "Your emotional weather hasn't been logged in a while. Come back when you can.",
  },
];

let nudgeIndex = 0;

function pickNudge() {
  const msg = NUDGE_MESSAGES[nudgeIndex % NUDGE_MESSAGES.length];
  nudgeIndex += 1;
  return msg;
}

async function getLastCheckInTime(): Promise<number> {
  // Get the most recent mood log or journal entry timestamp
  const [moodRes, journalRes] = await Promise.all([
    supabase
      .from("mood_logs")
      .select("logged_at")
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("journals")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const moodTime = moodRes.data?.logged_at
    ? new Date(moodRes.data.logged_at).getTime()
    : 0;
  const journalTime = journalRes.data?.created_at
    ? new Date(journalRes.data.created_at).getTime()
    : 0;

  return Math.max(moodTime, journalTime);
}

async function requestPermissionGracefully(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  // Only prompt after the user has been in the app — not immediately on load
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

function sendNudge() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const { title, body } = pickNudge();
  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "aura-nudge", // replaces previous nudge instead of stacking
    });
  } catch {
    // Notifications blocked or in an iframe — silently fail
  }
}

export function useNudgeEngine() {
  const permissionAsked = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Ask for notification permission ~10s after mount (non-intrusive)
    const permTimer = setTimeout(async () => {
      if (permissionAsked.current) return;
      permissionAsked.current = true;
      await requestPermissionGracefully();
    }, 10_000);

    // Check every 30 min whether a nudge is warranted
    const check = async () => {
      if (Notification.permission !== "granted") return;
      try {
        const lastTime = await getLastCheckInTime();
        const silence = Date.now() - (lastTime || 0);
        if (silence >= SILENCE_THRESHOLD_MS) sendNudge();
      } catch {
        // Silently ignore — don't crash the app over a notification
      }
    };

    intervalRef.current = setInterval(check, NUDGE_INTERVAL_MS);

    return () => {
      clearTimeout(permTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
