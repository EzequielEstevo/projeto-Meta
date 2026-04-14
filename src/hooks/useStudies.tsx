import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Discipline {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  discipline_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useDisciplines() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["disciplines", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("disciplines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      if (error) throw error;
      return data as Discipline[];
    },
    enabled: !!user,
  });
}

export function useTopics(disciplineId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["topics", user?.id, disciplineId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      let query = supabase
        .from("topics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      if (disciplineId) {
        query = query.eq("discipline_id", disciplineId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!user,
  });
}

export function useCreateDiscipline() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (discipline: { name: string; color: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("disciplines")
        .insert({ ...discipline, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["disciplines"] }),
  });
}

export function useUpdateDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name: string; color: string }) => {
      const { error } = await supabase
        .from("disciplines")
        .update({ name, color })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["disciplines"] }),
  });
}

export function useDeleteDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("disciplines")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplines"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (topic: { title: string; discipline_id: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("topics")
        .insert({ ...topic, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, completed }: { id: string; title?: string; completed?: boolean }) => {
      const updates: Record<string, unknown> = {};
      if (title !== undefined) updates.title = title;
      if (completed !== undefined) updates.completed = completed;
      const { error } = await supabase
        .from("topics")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}
