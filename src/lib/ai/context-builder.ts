import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

export interface EmotionalContext {
  weatherState: string | null;
  activeArc: string | null;
  recentJournals: { content: string; tags: string[] }[];
  recentExperiences: { slug: string; tags: string[] }[];
  currentTimeOfDay: string;
}

export async function buildEmotionalContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  localTimeStr?: string // Pass user's local time string if available
): Promise<EmotionalContext> {
  // Fetch current emotional weather
  const { data: weather } = await supabase
    .from("emotional_weather")
    .select("weather_state")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch active arc
  const { data: arcs } = await supabase
    .from("emotional_arcs")
    .select("arc_name")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch recent journals with tags
  const { data: journals } = await supabase
    .from("journals")
    .select("content, atmosphere_tags")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch recent completed experiences
  const { data: experiences } = await supabase
    .from("completed_experiences")
    .select("experience_slug, atmosphere_tags")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(3);

  // Determine time of day vaguely if local time is provided, else fallback
  let timeOfDay = "Daytime";
  if (localTimeStr) {
    try {
      const hour = new Date(localTimeStr).getHours();
      if (hour >= 2 && hour < 5) timeOfDay = "Deep Night";
      else if (hour >= 5 && hour < 12) timeOfDay = "Morning";
      else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
      else if (hour >= 17 && hour < 21) timeOfDay = "Evening";
      else timeOfDay = "Late Night";
    } catch {
      // ignore
    }
  }

  return {
    weatherState: weather?.weather_state ?? "Neutral",
    activeArc: arcs?.arc_name ?? null,
    recentJournals: (journals ?? []).map(j => ({
      content: j.content,
      tags: j.atmosphere_tags ?? [],
    })),
    recentExperiences: (experiences ?? []).map(e => ({
      slug: e.experience_slug,
      tags: e.atmosphere_tags ?? [],
    })),
    currentTimeOfDay: timeOfDay,
  };
}

export function formatContextForPrompt(ctx: EmotionalContext): string {
  let prompt = `[ATMOSPHERE & TIME]\n`;
  prompt += `Current Time: ${ctx.currentTimeOfDay}\n`;
  prompt += `Emotional Weather: ${ctx.weatherState}\n`;
  if (ctx.activeArc) {
    prompt += `Active Life Chapter (Arc): ${ctx.activeArc}\n`;
  }
  
  if (ctx.recentExperiences.length > 0) {
    prompt += `\n[RECENT EXPERIENCES]\n`;
    prompt += ctx.recentExperiences
      .map((e) => `- ${e.slug} (Tags: ${e.tags.join(", ")})`)
      .join("\n") + "\n";
  }

  if (ctx.recentJournals.length > 0) {
    prompt += `\n[RECENT JOURNAL REFLECTIONS]\n`;
    prompt += ctx.recentJournals
      .map((j) => `- "${j.content.slice(0, 80)}..." (Tags: ${j.tags.join(", ")})`)
      .join("\n") + "\n";
  }

  return prompt;
}
