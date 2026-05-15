import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type MoodLog = {
  id: string;
  mood: string;
  energy: number | null;
  note: string | null;
  logged_at: string;
};

export function useMoodLogs() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: logs = [] } = useQuery({
    queryKey: ["mood_logs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_logs" as any)
        .select("*")
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as MoodLog[];
    },
  });

  const logMood = useMutation({
    mutationFn: async (payload: { mood: string; energy?: number; note?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("mood_logs" as any)
        .insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mood_logs", user?.id] });
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return { logs, logMood: logMood.mutateAsync, isPending: logMood.isPending };
}
