import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WeeklyRoutine {
  id: string;
  user_id: string;
  title: string;
  day_of_week: number;
  time_slot: string | null;
  xp_reward: number;
  completed: boolean;
  week_start: string;
  created_at: string;
  discipline_id: string | null;
  topic_id: string | null;
}

function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split("T")[0];
}

export function useWeeklyRoutines() {
  const { user } = useAuth();
  const weekStart = getCurrentWeekStart();

  return useQuery({
    queryKey: ["weekly_routines", user?.id, weekStart],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("weekly_routines")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .order("day_of_week")
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as WeeklyRoutine[];
    },
    enabled: !!user,
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (routine: {
      title: string;
      day_of_week: number;
      time_slot?: string | null;
      xp_reward?: number;
      discipline_id?: string | null;
      topic_id?: string | null;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const weekStart = getCurrentWeekStart();
      const { data, error } = await supabase
        .from("weekly_routines")
        .insert({ ...routine, user_id: user.id, week_start: weekStart })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_routines"] });
    },
  });
}

export function useToggleRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("weekly_routines")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_routines"] });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("weekly_routines")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_routines"] });
    },
  });
}
