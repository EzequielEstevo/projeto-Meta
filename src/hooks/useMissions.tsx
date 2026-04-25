import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { type Rank } from "@/components/ui/RankBadge";

export type MissionStatus = "available" | "in_progress" | "completed" | "failed";

export interface Mission {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  rank: Rank;
  status: MissionStatus;
  xp_reward: number;
  time_slot: string | null;
  duration: string | null;
  priority: string;
  mission_type: string;
  stat_rewards: { stat: string; value: number }[];
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Subtask {
  id: string;
  mission_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
}

export function useMissions(type?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["missions", user?.id, type],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      let query = supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (type) {
        query = query.eq("mission_type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((d) => ({
        ...d,
        stat_rewards: (d as unknown as Mission).stat_rewards ?? [],
      })) as Mission[];
    },
    enabled: !!user,
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (mission: {
      title: string;
      description?: string;
      rank?: string;
      xp_reward?: number;
      time_slot?: string;
      duration?: string;
      priority?: string;
      mission_type?: string;
      stat_rewards?: { stat: string; value: number }[];
      due_date?: string;
      subtasks?: string[];
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { subtasks, ...missionData } = mission;

      const { data: newMission, error } = await supabase
        .from("missions")
        .insert({ ...missionData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      if (subtasks && subtasks.length > 0) {
        const subtaskRows = subtasks.map((title, i) => ({
          mission_id: newMission.id,
          title,
          sort_order: i,
        }));
        const { error: subError } = await supabase
          .from("subtasks")
          .insert(subtaskRows);
        if (subError) throw subError;
      }

      return newMission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}

export function useUpdateMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Mission> & { id: string }) => {
      const { data, error } = await supabase
        .from("missions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}

export function useDeleteMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("missions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}

export function useSubtasks(missionId: string) {
  return useQuery({
    queryKey: ["subtasks", missionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .eq("mission_id", missionId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Subtask[];
    },
    enabled: !!missionId,
  });
}

export function useToggleSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("subtasks")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
    },
  });
}
