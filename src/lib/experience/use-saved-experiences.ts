import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export function useSavedExperiences() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: saved = [] } = useQuery({
    queryKey: ["saved-experiences", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_experiences")
        .select("experience_slug, saved_at")
        .order("saved_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const slugs = new Set(saved.map((s) => s.experience_slug));

  const toggle = useMutation({
    mutationFn: async (slug: string) => {
      if (!user) throw new Error("Not signed in");
      if (slugs.has(slug)) {
        const { error } = await supabase
          .from("saved_experiences").delete()
          .eq("user_id", user.id).eq("experience_slug", slug);
        if (error) throw error;
        return { slug, action: "removed" as const };
      } else {
        const { error } = await supabase
          .from("saved_experiences").insert({ user_id: user.id, experience_slug: slug });
        if (error) throw error;
        return { slug, action: "added" as const };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-experiences", user?.id] }),
  });

  return { savedSlugs: slugs, savedList: saved, toggleSave: toggle.mutate };
}
