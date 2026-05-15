import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AICompanionOrb } from "@/components/companion/AICompanionOrb";
import { StarfieldBackground } from "@/components/companion/StarfieldBackground";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const moods = ["Calm", "Curious", "Heavy", "Hopeful", "Restless", "Tender"];
const intentionsList = ["Self-discovery", "Emotional balance", "Creative flow", "Reflection", "Healing", "Growth", "Connection", "Adventure"];
const tones = ["Gentle & poetic", "Warm & encouraging", "Honest & direct", "Playful & curious"];
const focusAreasList = ["Mind", "Heart", "Body", "Creativity", "Relationships", "Purpose"];

function Onboarding() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<string | null>(null);
  const [intentions, setIntentions] = useState<string[]>([]);
  const [tone, setTone] = useState<string | null>(null);
  const [focus, setFocus] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const finish = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      display_name: name || null,
      current_mood: mood,
      intentions,
      tone_preference: tone,
      focus_areas: focus,
      onboarding_completed: true,
    }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Your universe is ready");
    navigate({ to: "/dashboard" });
  };

  const steps = [
    { title: "What shall we call you?", body: (
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="text-center text-lg" />
    ), canNext: name.trim().length > 0 },
    { title: "How are you arriving today?", body: (
      <div className="flex flex-wrap justify-center gap-2">
        {moods.map((m) => (
          <Chip key={m} active={mood === m} onClick={() => setMood(m)}>{m}</Chip>
        ))}
      </div>
    ), canNext: !!mood },
    { title: "What draws you here?", subtitle: "Choose any that resonate", body: (
      <div className="flex flex-wrap justify-center gap-2">
        {intentionsList.map((i) => (
          <Chip key={i} active={intentions.includes(i)} onClick={() => toggle(intentions, i, setIntentions)}>{i}</Chip>
        ))}
      </div>
    ), canNext: intentions.length > 0 },
    { title: "How should I speak with you?", body: (
      <div className="flex flex-wrap justify-center gap-2">
        {tones.map((t) => (<Chip key={t} active={tone === t} onClick={() => setTone(t)}>{t}</Chip>))}
      </div>
    ), canNext: !!tone },
    { title: "Where would you like to grow?", subtitle: "Pick a few areas of focus", body: (
      <div className="flex flex-wrap justify-center gap-2">
        {focusAreasList.map((f) => (
          <Chip key={f} active={focus.includes(f)} onClick={() => toggle(focus, f, setFocus)}>{f}</Chip>
        ))}
      </div>
    ), canNext: focus.length > 0 },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarfieldBackground />
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 animate-float-slow"><AICompanionOrb size={140} /></div>

        <div className="mb-6 flex w-full max-w-sm gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="glass-strong w-full rounded-3xl p-8 text-center">
            <h2 className="font-display text-3xl">{current.title}</h2>
            {current.subtitle && <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>}
            <div className="mt-8">{current.body}</div>
            <div className="mt-10 flex justify-between">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
              {!isLast ? (
                <Button disabled={!current.canNext} onClick={() => setStep(step + 1)}
                  className="bg-primary text-primary-foreground glow-primary hover:opacity-90">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button disabled={!current.canNext || busy} onClick={finish}
                  className="bg-primary text-primary-foreground glow-primary hover:opacity-90">
                  {busy ? "Opening…" : "Enter your universe"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-all ${
        active
          ? "border-primary bg-primary/20 text-foreground shadow-[0_0_20px] shadow-primary/40"
          : "border-border bg-background/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}>
      {children}
    </button>
  );
}
