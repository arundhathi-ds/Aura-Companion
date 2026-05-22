/**
 * DailyJourney.tsx
 * Cinematic "Two Doors" Experience.
 * Focused on emotional safety, artistic curiosity, and gentle exploration.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, Star, Moon, Globe, Compass, Home, Eye, AlertCircle, Sparkle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateCinematicExperience } from "@/lib/experience/personalized-engine";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCompletedExperiences } from "@/lib/experience/use-completed";

const COMFORT_ZONES = [
  { key: "Window", desc: "Just look out and notice." },
  { key: "Doorstep", desc: "One foot out, safe and close." },
  { key: "Porch", desc: "A few steps further into the open." },
  { key: "Neighborhood", desc: "Wandering down familiar paths." },
  { key: "City", desc: "Sensing the wider atmosphere." },
  { key: "Adventure", desc: "Wherever the wind pulls us." }
];

const LOADING_LINES = [
  "Noticing the silence in your space...",
  "Finding a safe, quiet corner for you...",
  "Mapping a gentle path for this version of you...",
  "Listening for what today needs...",
  "Tuning into your implicit emotional frequencies...",
  "Curating a tiny quiet adventure..."
];

type Step = "door" | "zone" | "generating" | "journey" | "reflection" | "complete";

type RareEvent = {
  key: string;
  badge: string;
  style: {
    border: string;
    glow: string;
    textTint: string;
    bgGradient: string;
    badgeBg: string;
  };
  loaderLine: string;
} | null;

export function DailyJourney({ user, history }: { user: any, history?: string }) {
  const [step, setStep] = useState<Step>("door");
  const [door, setDoor] = useState<"Stay With Me" | "Let's Go Somewhere" | "">("");
  const [zone, setZone] = useState("");
  const [experience, setExperience] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [reflection, setReflection] = useState("");
  const [loadingLineIdx, setLoadingLineIdx] = useState(0);
  const [isSmallerVersion, setIsSmallerVersion] = useState(false);
  const [rareEvent, setRareEvent] = useState<RareEvent>(null);

  const generate = useServerFn(generateCinematicExperience);
  const { complete } = useCompletedExperiences();

  // Atmospheric Event Detection
  useEffect(() => {
    const d = new Date();
    const hour = d.getHours();
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;

    // Mood weather mapping
    const m = (user?.current_mood || "atmospheric").toLowerCase();

    let event: RareEvent = null;

    if (Math.random() < 0.05) {
      event = {
        key: "power-outage",
        badge: "Power Outage Transmission",
        style: {
          border: "border-amber-500/30",
          glow: "shadow-[0_0_50px_rgba(245,158,11,0.2)]",
          textTint: "text-amber-400",
          badgeBg: "bg-amber-950/40 border-amber-500/20",
          bgGradient: "from-amber-950/20 to-black/80"
        },
        loaderLine: "Igniting a digital candle in the dark..."
      };
    } else if (hour < 4 || hour >= 23) {
      event = {
        key: "midnight",
        badge: "Midnight-Only transmission",
        style: {
          border: "border-indigo-500/30",
          glow: "shadow-[0_0_50px_rgba(99,102,241,0.25)]",
          textTint: "text-indigo-400",
          badgeBg: "bg-indigo-950/40 border-indigo-500/20",
          bgGradient: "from-indigo-950/20 to-purple-950/20"
        },
        loaderLine: "Tuning into late-night cosmic signals..."
      };
    } else if (hour >= 17 && hour < 19) {
      event = {
        key: "golden-hour",
        badge: "Golden Hour Expedition",
        style: {
          border: "border-orange-500/30",
          glow: "shadow-[0_0_50px_rgba(249,115,22,0.25)]",
          textTint: "text-orange-400",
          badgeBg: "bg-orange-950/40 border-orange-500/20",
          bgGradient: "from-amber-950/15 to-orange-950/15"
        },
        loaderLine: "Catching the golden amber gradients..."
      };
    } else if (m === "heavy" || m === "restless") {
      event = {
        key: "storm",
        badge: "Storm Mode comfort ritual",
        style: {
          border: "border-sky-500/30",
          glow: "shadow-[0_0_50px_rgba(14,165,233,0.2)]",
          textTint: "text-sky-400",
          badgeBg: "bg-sky-950/40 border-sky-500/20",
          bgGradient: "from-sky-950/25 to-slate-950/45"
        },
        loaderLine: "Quietly sheltering you from the inner storm..."
      };
    } else if (isWeekend) {
      event = {
        key: "weekend",
        badge: "Weekend Wandering active",
        style: {
          border: "border-emerald-500/30",
          glow: "shadow-[0_0_50px_rgba(16,185,129,0.2)]",
          textTint: "text-emerald-400",
          badgeBg: "bg-emerald-950/40 border-emerald-500/20",
          bgGradient: "from-emerald-950/15 to-teal-950/15"
        },
        loaderLine: "Stretching out into Saturday morning space..."
      };
    }

    setRareEvent(event);
  }, [user]);

  // Cinematic loader line switching
  useEffect(() => {
    if (step === "generating") {
      const interval = setInterval(() => {
        setLoadingLineIdx((i) => (i + 1) % LOADING_LINES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const startGeneration = async (selectedDoor: "Stay With Me" | "Let's Go Somewhere", selectedZone?: string) => {
    setDoor(selectedDoor);
    if (selectedZone) setZone(selectedZone);
    setStep("generating");

    // Map mood weather to energy context
    const m = (user?.current_mood || "atmospheric").toLowerCase();
    let energyLevel = "Normal";
    if (m === "heavy") energyLevel = "Low";
    else if (m === "restless") energyLevel = "High";
    else if (m === "curious") energyLevel = "Playful";
    else if (m === "calm") energyLevel = "Quiet";
    else if (m === "tender") energyLevel = "Gentle";

    try {
      const res = await generate({ data: { 
        userId: user.id, 
        mood: user?.current_mood || "Atmospheric", 
        door: selectedDoor, 
        zone: selectedZone,
        time: new Date().toLocaleTimeString(), 
        history,
        weather: rareEvent ? rareEvent.badge : "Clear Sky",
        energy: energyLevel
      }});
      setExperience(res);
      setStep("journey");
      setCurrentStepIdx(0);
      setIsSmallerVersion(false);
    } catch (e) {
      toast.error("The cosmic signals are hazy. Let's stay close for a breath.");
      setStep("door");
    }
  };

  const nextStep = () => {
    if (currentStepIdx < (experience?.steps?.length || 0) - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setStep("reflection");
    }
  };

  const saveFieldNote = async () => {
    if (!reflection.trim()) return toast.error("Write down just one small detail.");
    try {
      await complete({
        experience_slug: experience?.title?.toLowerCase().replace(/ /g, "-") || "art-ritual",
        note: reflection,
        mood_before: door,
        mood_after: zone || "Home"
      });
      setStep("complete");
    } catch (e) {
      toast.error("Couldn't write in the notebook. Let's try again.");
    }
  };

  const getStepInstruction = () => {
    if (!experience?.steps?.[currentStepIdx]) return "";
    const original = experience.steps[currentStepIdx].instruction;
    if (isSmallerVersion) {
      return `Smaller version: Imagine or visualize doing this gently. ${original.replace(/Walk to|Go to|Visit|Buy/i, "Imagine visiting")}`;
    }
    return original;
  };

  return (
    <motion.div 
      layout 
      className={`glass relative min-h-[460px] rounded-[32px] p-8 overflow-hidden flex flex-col justify-between transition-all duration-500 border ${
        rareEvent ? `${rareEvent.style.border} ${rareEvent.style.glow}` : "border-white/5 shadow-xl"
      }`}
      style={
        rareEvent
          ? {
              background: `linear-gradient(to bottom, var(--glass-bg), var(--glass-bg)), linear-gradient(135deg, var(--glass-bg), ${rareEvent.style.bgGradient.split(" ")[0].replace("from-", "")})`,
            }
          : undefined
      }
    >
      {/* Dynamic Rare Event Badge */}
      {rareEvent && step !== "complete" && (
        <div className={`absolute top-4 right-6 flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest font-medium border ${rareEvent.style.badgeBg}`}>
          <Sparkle size={10} className={`animate-spin-slow ${rareEvent.style.textTint}`} />
          <span className={rareEvent.style.textTint}>{rareEvent.badge}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* 1. Door Selection */}
        {step === "door" && (
          <motion.div key="door" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Transmission</p>
              <h2 className="text-3xl font-light mt-1">What side quest calls to you?</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <button 
                onClick={() => startGeneration("Stay With Me")} 
                className="group relative flex flex-col items-center justify-between text-center rounded-[24px] border border-white/5 bg-white/5 p-6 hover:border-primary/20 hover:bg-white/10 transition duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition duration-300">
                  <Home size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Stay With Me</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Sensory exploration, cozy rituals, and finding tiny aesthetic coordinates inside your room.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-primary-glow mt-4 opacity-0 group-hover:opacity-100 transition duration-300">Enter Door →</span>
              </button>

              <button 
                onClick={() => setStep("zone")} 
                className="group relative flex flex-col items-center justify-between text-center rounded-[24px] border border-white/5 bg-white/5 p-6 hover:border-aurora/20 hover:bg-white/10 transition duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-aurora/10 flex items-center justify-center mb-4 text-aurora group-hover:scale-110 transition duration-300">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Let's Go Somewhere</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Low-pressure urban adventures, wrong turns on purpose, and playful outdoor missions.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-aurora mt-4 opacity-0 group-hover:opacity-100 transition duration-300">Enter Door →</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Comfort Zone Selector (Travel Door) */}
        {step === "zone" && (
          <motion.div key="zone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Expeditions</p>
              <h2 className="text-3xl font-light mt-1">Define your wandering radius</h2>
              <p className="text-xs text-muted-foreground mt-1">Aura shapes the side quest to keep you safe.</p>
            </div>

            <div className="grid gap-2 grid-cols-2">
              {COMFORT_ZONES.map((c) => (
                <button 
                  key={c.key} 
                  onClick={() => startGeneration("Let's Go Somewhere", c.key)} 
                  className="flex flex-col items-start gap-1 rounded-2xl border border-white/5 bg-white/5 p-4 text-left hover:border-aurora/30 transition duration-200"
                >
                  <span className="text-sm font-medium text-aurora">{c.key}</span>
                  <span className="text-[10px] text-muted-foreground leading-normal">{c.desc}</span>
                </button>
              ))}
            </div>

            <Button variant="ghost" onClick={() => setStep("door")} className="text-xs text-muted-foreground mt-2">Back to Doors</Button>
          </motion.div>
        )}

        {/* 3. Cinematic Loading */}
        {step === "generating" && (
          <motion.div key="generating" className="flex flex-col items-center justify-center text-center h-[360px]">
            <div className="relative mb-10">
              <motion.div 
                className={`h-20 w-20 rounded-full ${rareEvent ? "bg-primary/20" : "bg-primary/10"}`} 
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }} 
                transition={{ duration: 3, repeat: Infinity }} 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className={`animate-spin ${rareEvent ? rareEvent.style.textTint : "text-primary-glow"}`} size={24} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p 
                key={loadingLineIdx} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="text-sm italic text-muted-foreground max-w-sm leading-relaxed"
              >
                {rareEvent && loadingLineIdx === 0 ? rareEvent.loaderLine : LOADING_LINES[loadingLineIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* 4. Side Quest Steps */}
        {step === "journey" && experience && (
          <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-primary-glow">
                <Sparkle size={14} className="animate-pulse" />
                <span className={`text-[10px] uppercase tracking-widest ${rareEvent ? rareEvent.style.textTint : ""}`}>
                  {experience.title || "Side Quest"}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Act {currentStepIdx + 1} of {experience.steps?.length || 2}</span>
            </div>

            <div className="space-y-4 py-4">
              <AnimatePresence mode="wait">
                <motion.div key={currentStepIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-3">
                  <h3 className="text-2xl font-light leading-relaxed">{getStepInstruction()}</h3>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full ${rareEvent ? rareEvent.style.textTint.replace("text", "bg") : "bg-primary"}`} /> 
                    {experience.steps?.[currentStepIdx]?.vibe || "Atmospheric"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-3 mt-auto">
              <Button onClick={nextStep} className={`w-full rounded-2xl py-6 bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 transition ${rareEvent ? rareEvent.style.textTint : ""}`}>
                {currentStepIdx < (experience.steps?.length || 2) - 1 ? "I have done this" : "Complete Side Quest"} <ArrowRight className="ml-2" size={16} />
              </Button>

              {/* Travel Door helper options */}
              {door === "Let's Go Somewhere" && (
                <div className="flex justify-between gap-2 text-[10px] text-muted-foreground">
                  <button 
                    onClick={() => setIsSmallerVersion(!isSmallerVersion)} 
                    className={`flex-1 py-2 border rounded-xl hover:bg-white/5 transition flex items-center justify-center gap-1 ${isSmallerVersion ? "border-aurora/50 text-aurora" : "border-white/5"}`}
                  >
                    <Eye size={12} /> {isSmallerVersion ? "Normal quest" : "Smaller quest"}
                  </button>
                  <button 
                    onClick={() => setStep("reflection")} 
                    className="flex-1 py-2 border border-white/5 rounded-xl hover:bg-white/5 transition flex items-center justify-center gap-1"
                  >
                    <Globe size={12} /> Just share reflection
                  </button>
                  <button 
                    onClick={() => { setStep("door"); setDoor(""); }} 
                    className="flex-1 py-2 border border-white/5 rounded-xl hover:bg-red-950/20 hover:text-red-300 transition flex items-center justify-center gap-1"
                  >
                    <AlertCircle size={12} /> Cancel transmission
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5. Field Notes Reflection */}
        {step === "reflection" && experience && (
          <motion.div key="reflection" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between h-full space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Field Note</p>
              <h3 className="text-2xl font-light mt-1">{experience.fieldNoteQuestion || "What detail stayed with you?"}</h3>
            </div>

            <textarea 
              autoFocus 
              value={reflection} 
              onChange={(e) => setReflection(e.target.value)} 
              placeholder="Write down one single visual detail or sentence..." 
              className="w-full min-h-[140px] bg-transparent border-none outline-none text-xl resize-none placeholder:text-muted-foreground/30 leading-relaxed" 
            />

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep("journey")} className="text-xs text-muted-foreground">Back</Button>
              <Button onClick={saveFieldNote} className="flex-1 rounded-2xl py-6 bg-primary text-primary-foreground font-medium glow-primary">
                Record in Notebook
              </Button>
            </div>
          </motion.div>
        )}

        {/* 6. Complete screen */}
        {step === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center h-[360px] space-y-6">
            <div className="h-16 w-16 rounded-full bg-aurora/10 flex items-center justify-center shadow-[0_0_30px_oklch(0.85_0.15_200/0.25)]">
              <Star className="text-aurora fill-aurora" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-light">Memory Saved</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                That was an extraordinary coordinate of presence. Aura is holding onto this memory for you.
              </p>
            </div>
            <p className="text-xs italic text-muted-foreground/60 mt-4">
              "Maybe there is still something worth noticing tomorrow."
            </p>
            <Button variant="ghost" onClick={() => setStep("door")} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mt-4">
              Choose Another Door
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
