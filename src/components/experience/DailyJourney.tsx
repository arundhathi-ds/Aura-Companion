/**
 * DailyJourney.tsx
 * Cinematic Emotional Exploration Engine.
 * Features: Vibe Modes, Multi-step rituals, Hidden Outcomes, and Story Continuity.
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, Check, Heart, ArrowRight, Loader2, Globe, Star, Moon, Sun, Coffee, BookOpen, MapPin, Zap } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateCinematicExperience } from "@/lib/experience/personalized-engine";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const VIBE_MODES = [
  { key: "Stay In", icon: <Home size={14}/> },
  { key: "Go Outside", icon: <MapPin size={14}/> },
  { key: "Romanticize My Life", icon: <Heart size={14}/> },
  { key: "Creative Escape", icon: <Zap size={14}/> },
  { key: "Main Character Energy", icon: <Star size={14}/> },
  { key: "Social Energy", icon: <Users size={14}/> },
  { key: "Tiny Reset", icon: <Moon size={14}/> },
  { key: "Surprise Me", icon: <Sparkles size={14}/> },
];

const LOADING_LINES = [
  "Reading your emotional weather...",
  "Finding something for this version of you...",
  "Listening for what today needs...",
  "Searching for a meaningful moment...",
];

type Step = "mood" | "vibe" | "generating" | "journey" | "reflection" | "outcome" | "complete";

export function DailyJourney({ user, history }: { user: any, history?: string }) {
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState("");
  const [vibeMode, setVibeMode] = useState("");
  const [experience, setExperience] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [reflection, setReflection] = useState("");
  const [loadingLineIdx, setLoadingLineIdx] = useState(0);
  const [nearby, setNearby] = useState("");
  
  const generate = useServerFn(generateCinematicExperience);

  // Cinematic loader animation
  useEffect(() => {
    if (step === "generating") {
      const interval = setInterval(() => {
        setLoadingLineIdx((i) => (i + 1) % LOADING_LINES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const startGeneration = async (mode: string) => {
    setVibeMode(mode);
    setStep("generating");
    try {
      const res = await generate({ data: { 
        mood, vibeMode: mode, time: new Date().toLocaleTimeString(), nearby, history
      }});
      setExperience(res);
      setStep("journey");
      setCurrentStepIdx(0);
    } catch (e) {
      toast.error("The stars are hazy. Let's try again.");
      setStep("mood");
    }
  };

  const nextStep = () => {
    if (currentStepIdx < (experience?.steps?.length || 0) - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setStep("reflection");
    }
  };

  return (
    <motion.div layout className="glass relative min-h-[440px] rounded-[32px] p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* 1. Mood Check-In */}
        {step === "mood" && (
          <motion.div key="mood" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="text-3xl font-light">How are you feeling?</h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Calm", "Curious", "Heavy", "Hopeful", "Restless", "Tender", "Creative", "Lonely", "Drained"].map((m) => (
                <button key={m} onClick={() => { setMood(m); setStep("vibe"); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition">
                  {m}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 2. Vibe Mode Selection */}
        {step === "vibe" && (
          <motion.div key="vibe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-light mb-8">Choose your intention</h2>
            <div className="grid grid-cols-2 gap-2">
              {VIBE_MODES.map((v) => (
                <button key={v.key} onClick={() => startGeneration(v.key)} className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-left text-sm hover:border-primary/30 transition">
                  {v.icon} <span className="opacity-80">{v.key}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. Cinematic Loading */}
        {step === "generating" && (
          <motion.div key="gen" className="flex h-[300px] flex-col items-center justify-center text-center">
            <div className="relative mb-12">
              <motion.div className="h-20 w-20 rounded-full bg-primary/20" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
              <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary-glow" /></div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingLineIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm italic text-muted-foreground">
                {LOADING_LINES[loadingLineIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* 4. Progressive Journey Reveal */}
        {step === "journey" && experience && (
          <motion.div key="journey" className="flex h-full flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-primary-glow">
                <Sparkles size={14}/>
                <span className="text-[10px] uppercase tracking-widest">{experience.isChallenge ? "Aura Challenge" : "Ritual"}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Step {currentStepIdx + 1} of {experience.steps.length}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentStepIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-light leading-snug mb-4">{experience.steps[currentStepIdx].instruction}</h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary" /> {experience.steps[currentStepIdx].vibe}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-8">
              <Button onClick={nextStep} className="w-full rounded-2xl py-6 bg-primary/20 text-primary-glow border border-primary/20 hover:bg-primary/30">
                {currentStepIdx < experience.steps.length - 1 ? "I've done this" : "Complete Ritual"} <ArrowRight className="ml-2" size={16}/>
              </Button>
            </div>
          </motion.div>
        )}

        {/* 5. Outcome Reveal (The "Secret") */}
        {step === "outcome" && experience && (
          <motion.div key="outcome" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-aurora/10 flex items-center justify-center mb-6 shadow-[0_0_30px_oklch(0.7_0.2_300/0.2)]">
              <Star className="text-aurora fill-aurora" size={24}/>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-aurora mb-4">Hidden Insight Unlocked</p>
            <h3 className="text-xl italic font-light leading-relaxed px-4 mb-6">"{experience.hiddenOutcome.content}"</h3>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 max-w-xs">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-aurora font-medium uppercase tracking-widest text-[9px] block mb-2">Aura's Observation</span>
                {experience.hiddenOutcome.auraObservation}
              </p>
            </div>
            <Button onClick={() => setStep("complete")} variant="ghost" className="mt-8 text-xs text-muted-foreground">Continue to Memories</Button>
          </motion.div>
        )}

        {/* 6. Reflecting & Final */}
        {step === "reflection" && (
          <motion.div key="refl" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-2xl font-light mb-6">How do you feel now?</h3>
            <textarea autoFocus value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="A few words about the experience..." className="w-full min-h-[140px] bg-transparent border-none outline-none text-xl resize-none placeholder:text-muted-foreground/30" />
            <Button onClick={() => setStep("outcome")} className="w-full mt-6 rounded-2xl py-6 bg-primary text-primary-foreground">Save to Memories</Button>
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div key="comp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-aurora/20 flex items-center justify-center mb-6"><Heart className="h-8 w-8 text-aurora fill-aurora" /></div>
            <h3 className="text-2xl font-light mb-3">Discovery Recorded</h3>
            <p className="text-muted-foreground">That was a beautiful journey. Aura is remembering this for you.</p>
            <Button variant="ghost" onClick={() => setStep("mood")} className="mt-8 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">New Discovery</Button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

// Support components for icons
import { Home, Users } from "lucide-react";
