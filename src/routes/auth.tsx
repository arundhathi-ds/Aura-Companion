import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AICompanionOrb } from "@/components/companion/AICompanionOrb";
import { StarfieldBackground } from "@/components/companion/StarfieldBackground";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && user) {
      supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single().then(({ data }) => {
        if (data?.onboarding_completed) {
          navigate({ to: "/dashboard" });
        } else {
          navigate({ to: "/onboarding" });
        }
      });
    }
  }, [loading, user, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarfieldBackground />
      <div className="relative z-10 grid min-h-screen items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="hidden flex-col items-center gap-8 md:flex">
          <div className="animate-float-slow"><AICompanionOrb size={300} /></div>
          <div className="max-w-sm text-center">
            <h2 className="font-display text-3xl">A quiet space, just for you.</h2>
            <p className="mt-3 text-sm text-muted-foreground">Sign in and let your companion remember the rest.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="glass-strong mx-auto w-full max-w-md rounded-3xl p-8">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
          <h1 className="mt-3 font-display text-3xl">Welcome</h1>
          <p className="text-sm text-muted-foreground">Continue your inner journey.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin"><SignInForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}

function SignInForm() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  return (
    <form onSubmit={async (e) => {
      e.preventDefault(); setBusy(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) toast.error(error.message);
      else { toast.success("Welcome back"); navigate({ to: "/dashboard" }); }
    }} className="mt-6 space-y-4">
      <div className="space-y-2"><Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@cosmos.app" /></div>
      <div className="space-y-2"><Label htmlFor="si-pass">Password</Label>
        <Input id="si-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground glow-primary hover:opacity-90">
        {busy ? "Opening the door…" : "Sign in"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  return (
    <form onSubmit={async (e) => {
      e.preventDefault(); setBusy(true);
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { display_name: name } },
      });
      setBusy(false);
      if (error) toast.error(error.message);
      else if (data.session) { toast.success("Your universe is opening…"); navigate({ to: "/onboarding" }); }
      else toast.success("Almost there — check your email to confirm your account.");
    }} className="mt-6 space-y-4">
      <div className="space-y-2"><Label htmlFor="su-name">Your name</Label>
        <Input id="su-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="What shall we call you?" /></div>
      <div className="space-y-2"><Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="su-pass">Password</Label>
        <Input id="su-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground glow-primary hover:opacity-90">
        {busy ? "Creating space for you…" : "Begin"}
      </Button>
    </form>
  );
}
