import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  day_of_week: number;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  user_id: string;
  name: string;
  sets: string | null;
  reps: string | null;
  weight: string | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useWorkouts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["workouts", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      if (error) throw error;
      return data as Workout[];
    },
    enabled: !!user,
  });
}

export function useExercises(workoutId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["exercises", user?.id, workoutId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      let query = supabase
        .from("exercises")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      if (workoutId) {
        query = query.eq("workout_id", workoutId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Exercise[];
    },
    enabled: !!user,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (workout: { name: string; day_of_week: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("workouts")
        .insert({ ...workout, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, day_of_week }: { id: string; name?: string; day_of_week?: number }) => {
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (day_of_week !== undefined) updates.day_of_week = day_of_week;
      const { error } = await supabase
        .from("workouts")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (exercise: {
      name: string;
      workout_id: string;
      sets?: string;
      reps?: string;
      weight?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("exercises")
        .insert({ ...exercise, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      sets,
      reps,
      weight,
      notes,
      completed,
    }: {
      id: string;
      name?: string;
      sets?: string;
      reps?: string;
      weight?: string;
      notes?: string;
      completed?: boolean;
    }) => {
      const updates: Record<string, unknown> = {};
      if (name !== undefined) updates.name = name;
      if (sets !== undefined) updates.sets = sets;
      if (reps !== undefined) updates.reps = reps;
      if (weight !== undefined) updates.weight = weight;
      if (notes !== undefined) updates.notes = notes;
      if (completed !== undefined) updates.completed = completed;
      const { error } = await supabase
        .from("exercises")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
}
