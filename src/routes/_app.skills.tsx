import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/skills")({
  component: Page,
  head: () => ({ meta: [{ title: "Skills — Life Companion" }, { name: "description", content: "Practices and rituals to gently grow inside." }] }),
});

function Page() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl md:text-5xl">Skills</h1>
      <p className="mt-2 text-muted-foreground">Practices and rituals to gently grow inside.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[1,2,3,4].map((i) => (
          <div key={i} className="glass rounded-3xl p-6 transition hover:-translate-y-0.5">
            <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-primary/30 via-aurora/20 to-primary-glow/30" />
            <h3 className="mt-4 font-display text-xl">Coming soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">A gentle space your companion is preparing.</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
