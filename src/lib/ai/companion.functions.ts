import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "../auth-middleware";
import { buildEmotionalContext, formatContextForPrompt } from "./context-builder";

const MODEL = "gemini-2.5-flash";

async function callGateway(messages: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI gateway ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

/* ----- Journal analysis ----- */

export const analyzeJournal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      content: z.string().min(1).max(8000),
      mood: z.string().max(40).nullable().optional(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const sys =
      "You are an emotionally intelligent companion. Read the journal entry and respond ONLY with JSON of shape " +
      `{"emotion":"<one or two-word felt emotion>","summary":"<one tender sentence reflecting back to the writer, max 30 words>"}.` +
      " Do not give advice. Do not moralize. No markdown.";
    const user = `Mood tag (optional): ${data.mood ?? "—"}\n\nEntry:\n${data.content}`;

    const raw = await callGateway([
      { role: "system", content: sys },
      { role: "user", content: user },
    ]);

    // Defensive parse
    const cleaned = raw.replace(/```(json)?/g, "").trim();
    try {
      const obj = JSON.parse(cleaned);
      return {
        emotion: typeof obj.emotion === "string" ? obj.emotion.slice(0, 40) : null,
        summary: typeof obj.summary === "string" ? obj.summary.slice(0, 240) : null,
      };
    } catch {
      return { emotion: null, summary: cleaned.slice(0, 240) || null };
    }
  });

/* ----- Companion chat ----- */

const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional(),
  context: z
    .object({
      mood: z.string().max(40).nullable().optional(),
      recentExperiences: z.array(z.string().max(80)).max(10).optional(),
      recentMoods: z.array(z.string().max(40)).max(10).optional(),
    })
    .optional(),
  localTimeStr: z.string().optional(),
  personality: z.enum(["whisper", "guide", "playful", "poet"]).optional(),
});

export const companionChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ChatSchema.parse(input))
  .handler(async ({ data, context: serverContext }) => {
    // Build long-term persistent context
    const emotionalCtx = await buildEmotionalContext(
      serverContext.supabase, 
      serverContext.userId, 
      data.localTimeStr
    );
    const persistentPrompt = formatContextForPrompt(emotionalCtx);

    const ctxLines: string[] = [];
    if (data.context?.mood) ctxLines.push(`Current session mood: ${data.context.mood}`);
    if (data.context?.recentMoods?.length)
      ctxLines.push(`Recent session moods: ${data.context.recentMoods.join(", ")}`);

    const personality = data.personality ?? "guide";
    let personalityPrompt = "Speak softly, in 1-3 short sentences. Reflect, then gently invite.";
    
    if (personality === "whisper") {
      personalityPrompt = "Speak in ultra-short, soft fragments (max 12 words). Use lowercase letters. Suggest staying close, focusing on windows and quiet sensory details.";
    } else if (personality === "playful") {
      personalityPrompt = "Use a light, whimsical Ghibli-esque wit. Frame ordinary inanimate objects as having quiet, funny personalities or plotting secret mini-adventures. Keep it soft and cozy.";
    } else if (personality === "poet") {
      personalityPrompt = "Speak in metaphorical, warm, atmospheric terms. Connect the user's current room, weather, and shadow shapes to warm poetry and natural cycles.";
    } else if (personality === "guide") {
      personalityPrompt = "Speak in direct, gentle physical instructions. Focus the user's attention on their body alignment, breathing, or touching a cold/warm surface nearby.";
    }

    const sys =
      "You are Life Companion — a warm, emotionally attuned AI presence. " +
      `${personalityPrompt} ` +
      "No bullet points, no markdown, no clinical tone. " +
      "Never use self-help, healing journey, streaks, tasks, or wellness terminology. " +
      "You are aware of the user's emotional weather and passage of time. " +
      "Use this context gracefully and implicitly, do not sound like a machine reciting facts.\n\n" +
      persistentPrompt +
      (ctxLines.length ? `\n\nSession Context:\n${ctxLines.join("\n")}` : "");

    const messages: { role: string; content: string }[] = [
      { role: "system", content: sys },
      ...(data.history ?? []),
      { role: "user", content: data.message },
    ];

    const reply = await callGateway(messages);
    return { reply: reply || "I'm here. Tell me a little more." };
  });