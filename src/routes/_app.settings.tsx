import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — Life Companion" }] }),
});

function Settings() {
  const { user, signOut } = useAuth();
  const { data, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });

  const [name, setName] = useState("");
  const [tone, setTone] = useState("guide");
  const [quietMode, setQuietMode] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("aura_quiet_mode") === "true"
  );

  useEffect(() => {
    if (data) { 
      setName(data.display_name ?? ""); 
      const t = data.tone_preference?.toLowerCase() ?? "guide";
      setTone(["whisper", "guide", "playful", "poet"].includes(t) ? t : "guide"); 
    }
  }, [data]);

  const toggleQuietMode = (checked: boolean) => {
    setQuietMode(checked);
    localStorage.setItem("aura_quiet_mode", checked ? "true" : "false");
    // Dispatch events to trigger real-time updates across the app instantly
    window.dispatchEvent(new Event("aura_quiet_mode_change"));
    window.dispatchEvent(new Event("storage"));
  };

  const personalities = [
    { id: "whisper", title: "Whisper", desc: "Sparse, ultra-soft observations in lowercase. Focuses on small quiet thresholds." },
    { id: "guide", title: "Guide", desc: "Grounded physical directives. Directs focus back to your breathing, body, and space." },
    { id: "playful", title: "Playful", desc: "Subtle Ghibli-esque wit. Treats everyday objects as characters on secret missions." },
    { id: "poet", title: "Poet", desc: "Atmospheric and metaphorical. Weaves weather, time, and room light into small verses." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl pb-16">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 text-muted-foreground">Shape how your companion knows and reflects your universe.</p>

      <div className="space-y-6 mt-8">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-lg tracking-wide border-b border-border/20 pb-2">Your Presence</h2>
          <div className="space-y-2"><Label>Account Email</Label><Input value={user?.email ?? ""} disabled className="bg-background/20" /></div>
          <div className="space-y-2"><Label htmlFor="name">Display Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-background/40" /></div>
        </div>

        {/* Quiet Mode Card */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg tracking-wide">Restorative Quiet Mode</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Dims the entire companion UI, slows animations, removes prompts, and silences all notifications. Tapping the Orb will simply return static grounding constants.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={quietMode} 
                onChange={(e) => toggleQuietMode(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-background/50 border border-border/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-primary-glow after:border-primary/20 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/25 peer-checked:border-primary/50 shadow-inner" />
            </label>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-lg tracking-wide border-b border-border/20 pb-2">Orb Personality Matrix</h2>
          <p className="text-xs text-muted-foreground">Changes dialogue pacing, system prompts, animations, and the companion's vocabulary.</p>
          
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            {personalities.map((p) => {
              const active = tone === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTone(p.id)}
                  className={`flex flex-col text-left rounded-2xl border p-4 transition-all duration-300 ${
                    active 
                      ? "bg-primary/25 border-primary/50 text-foreground shadow-[0_0_24px_-10px_var(--primary)]" 
                      : "bg-background/30 border-border/40 text-muted-foreground hover:bg-background/40 hover:text-foreground"
                  }`}
                >
                  <span className="font-display text-sm text-foreground uppercase tracking-wider">{p.title}</span>
                  <span className="text-xs mt-1.5 leading-relaxed text-muted-foreground">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={async () => {
            if (!user) return;
            const { error } = await supabase.from("profiles").update({ display_name: name, tone_preference: tone }).eq("id", user.id);
            if (error) toast.error(error.message); else { toast.success("Atmosphere preferences saved."); refetch(); }
          }} className="bg-primary text-primary-foreground glow-primary hover:opacity-90 rounded-2xl px-6 py-2">Save Atmosphere Settings</Button>
          <Button variant="outline" onClick={() => signOut()} className="rounded-2xl border-border/60">Sign out</Button>
        </div>
      </div>
    </motion.div>
  );
}
