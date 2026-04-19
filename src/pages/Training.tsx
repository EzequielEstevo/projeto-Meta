import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useWorkouts,
  useExercises,
  useCreateWorkout,
  useUpdateWorkout,
  useDeleteWorkout,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExercise,
  type Workout,
  type Exercise,
} from "@/hooks/useTraining";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dumbbell,
  ArrowLeft,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  X,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Training() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();
  const { data: allExercises, isLoading: exercisesLoading } = useExercises();
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const deleteWorkout = useDeleteWorkout();
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();
  const { toast } = useToast();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newWorkoutNames, setNewWorkoutNames] = useState<Record<number, string>>({});
  const [newExercise, setNewExercise] = useState<Record<string, { name: string; sets: string; reps: string; weight: string }>>({});
  const [editingWorkout, setEditingWorkout] = useState<{ id: string; name: string } | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  if (authLoading || workoutsLoading || exercisesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-display text-primary text-glow-blue uppercase tracking-widest">Carregando Treinos...</p>
        </div>
      </div>
    );
  }

  const handleAddWorkout = async (dayIndex: number) => {
    const name = newWorkoutNames[dayIndex]?.trim();
    if (!name) return;
    await createWorkout.mutateAsync({ name, day_of_week: dayIndex });
    setNewWorkoutNames((prev) => ({ ...prev, [dayIndex]: "" }));
    toast({ title: "💪 Treino criado!", description: name });
  };

  const handleSaveWorkout = async () => {
    if (!editingWorkout) return;
    await updateWorkout.mutateAsync(editingWorkout);
    setEditingWorkout(null);
    toast({ title: "✏️ Treino atualizado!" });
  };

  const handleDeleteWorkout = async (id: string) => {
    await deleteWorkout.mutateAsync(id);
    toast({ title: "🗑️ Treino removido!" });
  };

  const handleAddExercise = async (workoutId: string) => {
    const data = newExercise[workoutId];
    if (!data?.name.trim()) return;
    await createExercise.mutateAsync({
      name: data.name,
      workout_id: workoutId,
      sets: data.sets,
      reps: data.reps,
      weight: data.weight,
    });
    setNewExercise((prev) => ({ ...prev, [workoutId]: { name: "", sets: "", reps: "", weight: "" } }));
    toast({ title: "🏋️ Exercício adicionado!" });
  };

  const handleSaveExercise = async () => {
    if (!editingExercise) return;
    await updateExercise.mutateAsync(editingExercise);
    setEditingExercise(null);
  };

  const handleToggleExercise = async (id: string, completed: boolean) => {
    await updateExercise.mutateAsync({ id, completed: !completed });
  };

  const workoutsByDay = DAYS.map((_, i) =>
    workouts?.filter((w) => w.day_of_week === i) ?? []
  );

  const getExercisesForWorkout = (workoutId: string) =>
    allExercises?.filter((e) => e.workout_id === workoutId) ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {DAYS.map((day, dayIndex) => {
              const dayWorkouts = workoutsByDay[dayIndex];

              return (
                <HolographicPanel key={day} variant="blue" className="flex flex-col">
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-bold text-lg text-foreground">
                      <span className="text-primary">[</span> {day} <span className="text-primary">]</span>
                    </h2>
                  </div>

                  {/* Workouts for this day */}
                  <div className="space-y-4 flex-1">
                    {dayWorkouts.map((workout) => {
                      const exercises = getExercisesForWorkout(workout.id);
                      const isExpanded = expandedId === workout.id;
                      const completedCount = exercises.filter((e) => e.completed).length;

                      return (
                        <div key={workout.id} className="border border-primary/10 rounded-lg p-2 bg-muted/5">
                          {editingWorkout?.id === workout.id ? (
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                value={editingWorkout.name}
                                onChange={(e) => setEditingWorkout({ ...editingWorkout, name: e.target.value })}
                                className="flex-1 h-7 text-xs bg-background/50 border-primary/20 font-body"
                                autoFocus
                              />
                              <button onClick={handleSaveWorkout} className="text-secondary hover:text-secondary/80"><Save className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingWorkout(null)} className="text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : workout.id)}>
                              {isExpanded ? <ChevronDown className="w-4 h-4 text-primary shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                              <span className="font-display font-bold text-sm text-foreground flex-1 truncate">{workout.name}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingWorkout({ id: workout.id, name: workout.name }); }}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(workout.id); }}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Exercises list */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-primary/10 space-y-2">
                              {exercises.map((exercise) => (
                                <div key={exercise.id}>
                                  {editingExercise?.id === exercise.id ? (
                                    <div className="flex flex-col gap-1 p-1 rounded bg-muted/20">
                                      <Input
                                        value={editingExercise.name}
                                        onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                                        className="h-6 text-[10px] bg-background/50 border-primary/10 font-body"
                                      />
                                      <div className="flex gap-1">
                                        <Input
                                          placeholder="S"
                                          value={editingExercise.sets || ""}
                                          onChange={(e) => setEditingExercise({ ...editingExercise, sets: e.target.value })}
                                          className="h-6 w-8 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                        />
                                        <Input
                                          placeholder="R"
                                          value={editingExercise.reps || ""}
                                          onChange={(e) => setEditingExercise({ ...editingExercise, reps: e.target.value })}
                                          className="h-6 w-8 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                        />
                                        <Input
                                          placeholder="W"
                                          value={editingExercise.weight || ""}
                                          onChange={(e) => setEditingExercise({ ...editingExercise, weight: e.target.value })}
                                          className="h-6 w-12 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                        />
                                        <button onClick={handleSaveExercise} className="text-secondary ml-auto"><Save className="w-3 h-3" /></button>
                                        <button onClick={() => setEditingExercise(null)} className="text-muted-foreground"><X className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={cn(
                                      "flex items-center gap-1 p-1 rounded border text-[11px] transition-all",
                                      exercise.completed
                                        ? "bg-secondary/10 border-secondary/30"
                                        : "bg-muted/10 border-primary/5"
                                    )}>
                                      <button
                                        onClick={() => handleToggleExercise(exercise.id, exercise.completed)}
                                        className={cn(
                                          "w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0",
                                          exercise.completed
                                            ? "bg-secondary border-secondary text-secondary-foreground"
                                            : "border-primary/40"
                                        )}
                                      >
                                        {exercise.completed && <Check className="w-2.5 h-2.5" />}
                                      </button>
                                      <span className={cn("flex-1 truncate font-body", exercise.completed && "line-through text-muted-foreground")}>
                                        {exercise.name}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground tabular-nums">
                                        {exercise.sets}x{exercise.reps}
                                      </span>
                                      <span className="text-[10px] text-primary w-8 text-right tabular-nums">
                                        {exercise.weight}
                                      </span>
                                      <button onClick={() => setEditingExercise(exercise)} className="text-muted-foreground hover:text-primary ml-1">
                                        <Pencil className="w-2.5 h-2.5" />
                                      </button>
                                      <button onClick={() => deleteExercise.mutate(exercise.id)} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Add exercise */}
                              <div className="flex flex-col gap-1 mt-2 p-1 border-t border-primary/5">
                                <Input
                                  placeholder="Exercício..."
                                  value={newExercise[workout.id]?.name ?? ""}
                                  onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { sets: "", reps: "", weight: "" }), name: e.target.value } }))}
                                  className="h-6 text-[10px] bg-background/50 border-primary/10 font-body"
                                />
                                <div className="flex gap-1">
                                  <Input
                                    placeholder="S"
                                    value={newExercise[workout.id]?.sets ?? ""}
                                    onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", reps: "", weight: "" }), sets: e.target.value } }))}
                                    className="h-6 w-8 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                  />
                                  <Input
                                    placeholder="R"
                                    value={newExercise[workout.id]?.reps ?? ""}
                                    onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", sets: "", weight: "" }), reps: e.target.value } }))}
                                    className="h-6 w-8 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                  />
                                  <Input
                                    placeholder="W"
                                    value={newExercise[workout.id]?.weight ?? ""}
                                    onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", sets: "", reps: "" }), weight: e.target.value } }))}
                                    className="h-6 w-12 text-center text-[10px] bg-background/50 border-primary/10 p-0"
                                  />
                                  <Button size="sm" variant="ghost" onClick={() => handleAddExercise(workout.id)} disabled={!newExercise[workout.id]?.name.trim()} className="h-6 w-6 p-0 text-primary ml-auto">
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add new workout for this day */}
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <div className="flex gap-1">
                        <Input
                          placeholder="Novo treino (ex: Peito)..."
                          value={newWorkoutNames[dayIndex] ?? ""}
                          onChange={(e) => setNewWorkoutNames((prev) => ({ ...prev, [dayIndex]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleAddWorkout(dayIndex)}
                          className="h-8 text-xs bg-background/50 border-primary/20 font-body"
                        />
                        <Button size="sm" onClick={() => handleAddWorkout(dayIndex)} disabled={!newWorkoutNames[dayIndex]?.trim()} className="h-8 w-8 p-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </HolographicPanel>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
