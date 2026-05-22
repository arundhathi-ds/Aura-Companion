import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Sparkles, Palette, Compass, BookOpen, Brain, GraduationCap, Settings, LogOut, Archive,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";

const items = [
  { title: "Dashboard",   url: "/dashboard",   icon: LayoutDashboard },
  { title: "Experiences", url: "/experiences", icon: Sparkles },
  { title: "The Attic",   url: "/attic",       icon: Archive },
  { title: "Creativity",  url: "/creativity",  icon: Palette },
  { title: "Discover",    url: "/discover",    icon: Compass },
  { title: "Journal",     url: "/journal",     icon: BookOpen },
  { title: "Memories",    url: "/memories",    icon: Brain },
  { title: "Settings",    url: "/settings",    icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { signOut, user } = useAuth();
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar/70 backdrop-blur-2xl">
      <SidebarHeader className="px-3 py-5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-full bg-orb animate-pulse-glow" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-lg">Life Companion</span>
            <span className="text-xs text-muted-foreground">your inner universe</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = path === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}
                      className="group/sb relative my-0.5 transition-all duration-300 hover:translate-x-0.5 hover:bg-sidebar-accent/60 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-[0_0_24px_-6px_var(--primary)]">
                      <Link to={item.url} className="flex items-center gap-3">
                        {active && (
                          <span aria-hidden className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                        )}
                        <item.icon className={`h-4 w-4 transition ${active ? "text-primary-glow drop-shadow-[0_0_6px_var(--primary-glow)]" : "group-hover/sb:text-primary-glow"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="glass rounded-2xl p-3 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm">{user?.email}</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
