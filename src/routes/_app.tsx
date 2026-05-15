import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StarfieldBackground } from "@/components/companion/StarfieldBackground";
import { FloatingCompanion } from "@/components/companion/FloatingCompanion";
import { useAuth } from "@/lib/auth-context";
import { useNudgeEngine } from "@/lib/notifications/use-nudge-engine";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

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
      <StarfieldBackground />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border/50 bg-background/30 px-4 backdrop-blur-xl">
            <SidebarTrigger />
            <span className="text-xs text-muted-foreground">A space of your own</span>
          </header>
          <main className="flex-1 p-6 md:p-10"><Outlet /></main>
        </div>
        <FloatingCompanion />
      </div>
    </SidebarProvider>
  );
}
