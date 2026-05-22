import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Archive, Plus, Feather, Camera, Compass, PenTool, Music, HelpCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/attic")({
  component: AtticMuseum,
  head: () => ({ meta: [{ title: "The Attic — Life Companion" }] }),
});

type ArtifactType = "photo" | "note" | "sketch" | "object" | "audio";

interface AtticArtifact {
  id: string;
  user_id: string;
  artifact_type: ArtifactType;
  description: string;
  observation: string | null;
  file_url: string | null;
  metadata: any;
  created_at: string;
}

function AtticMuseum() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | ArtifactType>("all");
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState("");
  const [observation, setObservation] = useState("");
  const [type, setType] = useState<ArtifactType>("object");
  const [fileUrl, setFileUrl] = useState("");

  const { data: artifacts = [], isLoading } = useQuery<AtticArtifact[]>({
    queryKey: ["attic_artifacts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attic_artifacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as AtticArtifact[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newArtifact: {
      artifact_type: ArtifactType;
      description: string;
      observation: string;
      file_url: string | null;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from("attic_artifacts")
        .insert([newArtifact])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attic_artifacts", user?.id] });
      toast.success("Placed gently in the Attic.");
      setDescription("");
      setObservation("");
      setFileUrl("");
      setShowAddForm(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not place artifact.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please name your artifact.");
      return;
    }
    if (!user) return;
    addMutation.mutate({
      artifact_type: type,
      description: description.trim(),
      observation: observation.trim(),
      file_url: fileUrl.trim() || null,
      user_id: user.id,
    });
  };

  const filteredArtifacts = filter === "all" 
    ? artifacts 
    : artifacts.filter((a) => a.artifact_type === filter);

  const getIcon = (t: ArtifactType) => {
    switch (t) {
      case "photo": return <Camera className="h-4 w-4" />;
      case "note": return <Feather className="h-4 w-4" />;
      case "sketch": return <PenTool className="h-4 w-4" />;
      case "audio": return <Music className="h-4 w-4" />;
      default: return <Compass className="h-4 w-4" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-foreground flex items-center gap-3">
            <Archive className="h-8 w-8 text-primary drop-shadow-[0_0_8px_var(--primary-glow)]" />
            The Attic
          </h1>
          <p className="mt-2 text-muted-foreground">
            A dusty, digital chest proving you have made things. Evidence of your existence in a quiet world.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-foreground transition-all duration-300 rounded-2xl flex items-center gap-2 px-4 py-2 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" /> Place an Artifact
        </Button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4">
        {(["all", "object", "note", "photo", "sketch", "audio"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-xl px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
              filter === cat
                ? "bg-primary text-primary-foreground shadow-[0_0_16px_-2px_var(--primary)]"
                : "bg-background/20 text-muted-foreground border border-border/40 hover:bg-background/40 hover:text-foreground"
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* Place an Artifact Modal Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong w-full max-w-lg rounded-3xl p-6 border border-border/60 relative overflow-hidden shadow-2xl"
            >
              <div aria-hidden className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
                Place in the Attic
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Name a physical object, an observation, or a sensory trace you want to preserve forever.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {(["object", "note", "photo", "sketch", "audio"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl py-2 text-[10px] font-medium tracking-wider uppercase border transition-all duration-300 ${
                        type === t 
                          ? "bg-primary/20 border-primary/50 text-foreground" 
                          : "bg-background/30 border-border/40 text-muted-foreground hover:bg-background/50 hover:text-foreground"
                      }`}
                    >
                      {getIcon(t)}
                      {t}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">What is this artifact called?</label>
                  <Input 
                    placeholder="e.g. A cracked blue marble found under the window sill" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-background/40 border-border/60 rounded-2xl py-2 px-3 focus-within:border-primary/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">What did you notice about it? (poetic reflection)</label>
                  <Textarea 
                    placeholder="e.g. It looks like a tiny planet frozen in ice. Holding it feels cold but solid." 
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    rows={3}
                    className="bg-background/40 border-border/60 rounded-2xl py-2 px-3 focus-within:border-primary/50 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Image/File Link (optional)</label>
                  <Input 
                    placeholder="Paste a photo URL if you captured one" 
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="bg-background/40 border-border/60 rounded-2xl py-2 px-3 focus-within:border-primary/50"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <Button 
                    type="submit" 
                    disabled={addMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground hover:opacity-90 glow-primary rounded-2xl py-2"
                  >
                    Place in Box
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="border-border/60 rounded-2xl py-2"
                  >
                    Close
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid of Saved Artifacts */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Unlocking the attic chest…
        </div>
      ) : filteredArtifacts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-background/10 py-16 px-4 text-center"
        >
          <Archive className="h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="font-display text-lg">Your Attic is empty</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            This space is built to hold traces of your physical presence. When you find a strange stone, write a tender observation, or sketch something ugly, place it here.
          </p>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="mt-6 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-foreground rounded-2xl"
          >
            Place your first trace
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredArtifacts.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-background/25 p-5 backdrop-blur-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_-20px_var(--primary)]"
            >
              {/* Vibe lines */}
              <div aria-hidden className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-background/40 border border-border/40 text-primary-glow group-hover:scale-110 transition-all duration-300">
                    {getIcon(art.artifact_type as ArtifactType)}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    {new Date(art.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>

                <h3 className="font-display text-md text-foreground group-hover:text-primary-glow transition-colors duration-300">
                  {art.description}
                </h3>

                {art.observation && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground italic">
                    "{art.observation}"
                  </p>
                )}

                {art.file_url && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-border/40 aspect-[4/3] bg-background/10">
                    <img 
                      src={art.file_url} 
                      alt={art.description || "artifact"} 
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/20 pt-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                  <HelpCircle className="h-3 w-3" />
                  Type: {art.artifact_type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
