import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  goal_type: "daily" | "weekly" | "monthly";
  completed: boolean;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export function useGoals(type?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals", user?.id, type],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      let query = supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true });

      if (type) {
        query = query.eq("goal_type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Goal[];
    },
    enabled: !!user,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: { title: string; goal_type: string; deadline: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("goals")
        .insert({ ...goal, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; completed?: boolean; title?: string }) => {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
