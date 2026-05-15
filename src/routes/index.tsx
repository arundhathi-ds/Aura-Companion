import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AICompanionOrb } from "@/components/companion/AICompanionOrb";
import { StarfieldBackground } from "@/components/companion/StarfieldBackground";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarfieldBackground />
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <span className="h-2 w-2 rounded-full bg-primary-glow shadow-[0_0_12px] shadow-primary-glow" />
          Life Companion
        </Link>
        <Link to="/auth"
          className="rounded-full border border-border bg-background/40 px-4 py-2 text-sm backdrop-blur hover:bg-accent">
          Sign in
        </Link>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-24 text-center md:pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="animate-float-slow">
          <AICompanionOrb size={260} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-background/30 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary-glow" />
            An emotionally intelligent presence
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
            Meet your <span className="text-aurora">inner universe</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Life Companion is a quiet, immersive AI that helps you feel, reflect, create and remember —
            a gentle mirror for the experiences that shape who you are.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-primary transition hover:scale-[1.02]">
              Begin your journey <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#how" className="rounded-full border border-border bg-background/30 px-6 py-3 text-sm backdrop-blur hover:bg-accent">
              How it feels
            </a>
          </div>
        </motion.div>
      </section>

      <section id="how" className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[
          { t: "Feel deeply", d: "Daily emotional check-ins that meet you wherever you are." },
          { t: "Create freely", d: "Spaces for writing, dreaming, and shaping new ideas." },
          { t: "Remember softly", d: "A living archive of moments, feelings and growth." },
        ].map((c, i) => (
          <motion.div key={c.t}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
