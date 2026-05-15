import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type CompletedExperience = {
  id: string;
  experience_slug: string;
  mood_before: string | null;
  mood_after: string | null;
  photo_url: string | null;
  note: string | null;
  duration_min: number | null;
  completed_at: string;
};

export function useCompletedExperiences() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: list = [] } = useQuery({
    queryKey: ["completed-experiences", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("completed_experiences" as any)
        .select("*")
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CompletedExperience[];
    },
  });

  const complete = useMutation({
    mutationFn: async (payload: {
      experience_slug: string;
      mood_before?: string | null;
      mood_after?: string | null;
      note?: string | null;
      photo_url?: string | null;
      duration_min?: number | null;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("completed_experiences" as any)
        .insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["completed-experiences", user?.id] });
      qc.invalidateQueries({ queryKey: ["timeline", user?.id] });
    },
  });

  return { completedList: list, completedSlugs: new Set(list.map((c) => c.experience_slug)), complete: complete.mutateAsync };
}