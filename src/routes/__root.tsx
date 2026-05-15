import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="font-display text-7xl text-aurora">404</h1>
        <p className="mt-3 text-muted-foreground">This corner of your universe doesn't exist yet.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="font-display text-2xl">A ripple in the cosmos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something didn't load right.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Try again</button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Life Companion — your emotional AI universe" },
      { name: "description", content: "An emotionally intelligent AI companion guiding your inner journey through experiences, creativity, journaling and memories." },
      { property: "og:title", content: "Life Companion" },
      { property: "og:description", content: "Your personal emotional AI universe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
