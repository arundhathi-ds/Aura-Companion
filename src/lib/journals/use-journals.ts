import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type JournalEntry = {
  id: string;
  mood: string | null;
  prompt: string | null;
  content: string;
  ai_emotion: string | null;
  ai_summary: string | null;
  created_at: string;
};

export function useJournals() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: list = [] } = useQuery({
    queryKey: ["journals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journals" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as JournalEntry[];
    },
  });

  const add = useMutation({
    mutationFn: async (payload: {
      mood: string | null;
      prompt: string | null;
      content: string;
      ai_emotion?: string | null;
      ai_summary?: string | null;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("journals" as any)
        .insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journals", user?.id] });
      qc.invalidateQueries({ queryKey: ["timeline", user?.id] });
    },
  });

  return { journals: list, addJournal: add.mutateAsync, isPending: add.isPending };
}