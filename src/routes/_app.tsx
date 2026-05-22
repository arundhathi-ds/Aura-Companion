import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StarfieldBackground } from "@/components/companion/StarfieldBackground";
import AmbientWorld from '@/components/atmosphere/AmbientWorld';
import { FloatingCompanion } from "@/components/companion/FloatingCompanion";
import AtmosphereProvider from '@/components/atmosphere/AtmosphereProvider';
import { useAuth } from "@/lib/auth-context";
import { useNudgeEngine } from "@/lib/notifications/use-nudge-engine";
import { useCinematicTime } from "@/hooks/useCinematicTime";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const atmosphere = useCinematicTime();

  const [isQuiet, setIsQuiet] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("aura_quiet_mode") === "true"
  );

  useEffect(() => {
    const handleSync = () => {
      setIsQuiet(localStorage.getItem("aura_quiet_mode") === "true");
    };
    window.addEventListener("aura_quiet_mode_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("aura_quiet_mode_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  useEffect(() => { 
    if (!loading && !user) {
      navigate({ to: "/auth" }); 
    } else if (!loading && user) {
      supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single().then(({ data }) => {
        if (data && !data.onboarding_completed) {
          navigate({ to: "/onboarding" });
        }
      });
    }
  }, [loading, user, navigate]);

  // Mount proactive nudge engine globally for all authenticated pages
  useNudgeEngine();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Tuning the cosmos…
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AtmosphereProvider>
      <StarfieldBackground />
      <AmbientWorld />
      <div 
        className={`flex min-h-screen w-full transition-all duration-1000 ease-in-out ${
          isQuiet ? "bg-black/95 brightness-[0.75] saturate-[0.6] transition-all duration-[3000ms]" : ""
        }`}
        style={{
          "--ambient-blur": isQuiet ? "4px" : atmosphere.blurIntensity,
          "--anim-speed": isQuiet ? "120s" : atmosphere.animationSpeed,
          "--primary": isQuiet ? "oklch(0.25 0.02 240)" : atmosphere.primary,
          "--primary-glow": isQuiet ? "oklch(0.12 0.01 240)" : atmosphere.glow,
          "--aurora": isQuiet ? "rgba(0,0,0,0.85)" : atmosphere.aurora,
        } as React.CSSProperties}
      >
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border/50 bg-background/30 px-4 backdrop-blur-xl">
            <SidebarTrigger />
            <span className="text-xs text-muted-foreground transition-colors duration-1000">A space of your own · {atmosphere.mood}</span>
          </header>
          <main className="flex-1 p-6 md:p-10"><Outlet /></main>
        </div>
        <FloatingCompanion />
        </div>
      </AtmosphereProvider>
    </SidebarProvider>
  );
}
