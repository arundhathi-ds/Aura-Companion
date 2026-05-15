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
  const [tone, setTone] = useState("");
  useEffect(() => {
    if (data) { setName(data.display_name ?? ""); setTone(data.tone_preference ?? ""); }
  }, [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 text-muted-foreground">Shape how your companion knows you.</p>

      <div className="glass mt-8 space-y-5 rounded-3xl p-6">
        <div className="space-y-2"><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
        <div className="space-y-2"><Label htmlFor="name">Display name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="tone">Companion tone</Label>
          <Input id="tone" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Gentle & poetic" /></div>
        <div className="flex gap-3 pt-2">
          <Button onClick={async () => {
            if (!user) return;
            const { error } = await supabase.from("profiles").update({ display_name: name, tone_preference: tone }).eq("id", user.id);
            if (error) toast.error(error.message); else { toast.success("Saved"); refetch(); }
          }} className="bg-primary text-primary-foreground glow-primary hover:opacity-90">Save</Button>
          <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
    </motion.div>
  );
}
