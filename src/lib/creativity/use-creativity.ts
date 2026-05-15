import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { CreativityCategory } from "@/data/creativity";

export type CompletedCreativity = {
  id: string;
  category: CreativityCategory;
  prompt: string;
  content: string | null;
  reflection: string | null;
  photo_url: string | null;
  completed_at: string;
};

export function useCreativity() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: completed = [] } = useQuery({
    queryKey: ["creativity", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("completed_creativity" as any)
        .select("*")
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CompletedCreativity[];
    },
  });

  const finish = useMutation({
    mutationFn: async (payload: {
      category: CreativityCategory;
      prompt: string;
      content?: string | null;
      reflection?: string | null;
      photo_url?: string | null;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("completed_creativity" as any)
        .insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creativity", user?.id] });
      qc.invalidateQueries({ queryKey: ["timeline", user?.id] });
    },
  });

  return { completed, finish: finish.mutateAsync };
}