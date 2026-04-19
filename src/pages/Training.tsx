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

  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const handleAddWorkout = async () => {
    const name = newWorkoutName.trim();
    if (!name) return;
    await createWorkout.mutateAsync({ name });
    setNewWorkoutName("");
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

  const getExercisesForWorkout = (workoutId: string) =>
    allExercises?.filter((e) => e.workout_id === workoutId) ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-8 h-8 text-primary" />
                <h1 className="font-display font-bold text-2xl text-glow-blue">GUIA DE TREINO</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="font-display text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Add Workout */}
          <HolographicPanel variant="blue" className="mb-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              <span className="text-primary">[</span> Novo Treino <span className="text-primary">]</span>
            </h2>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Ex: Treino A, Peito e Ombro, Leg Day..."
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddWorkout()}
                className="flex-1 h-10 bg-background/50 border-primary/20 font-body"
              />
              <Button size="sm" onClick={handleAddWorkout} disabled={!newWorkoutName.trim()} className="font-display">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
          </HolographicPanel>

          {/* Workouts List */}
          {(!workouts || workouts.length === 0) && (
            <div className="text-center py-16">
              <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-body">Nenhum treino cadastrado ainda.</p>
              <p className="text-muted-foreground/60 font-body text-sm mt-1">Crie seus treinos para começar a registrar sua evolução!</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {workouts?.map((workout) => {
              const exercises = getExercisesForWorkout(workout.id);
              const isExpanded = expandedId === workout.id;
              const completedCount = exercises.filter((e) => e.completed).length;

              return (
                <HolographicPanel key={workout.id} variant="blue" className="overflow-hidden">
                  {/* Workout header */}
                  {editingWorkout?.id === workout.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={editingWorkout.name}
                        onChange={(e) => setEditingWorkout({ ...editingWorkout, name: e.target.value })}
                        className="flex-1 h-8 text-sm bg-background/50 border-primary/20 font-body"
                        autoFocus
                      />
                      <button onClick={handleSaveWorkout} className="text-secondary hover:text-secondary/80"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingWorkout(null)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : workout.id)}>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-primary shrink-0" /> : <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
                      <span className="font-display font-bold text-lg text-foreground flex-1">{workout.name}</span>
                      <span className="text-xs text-muted-foreground font-body mr-2">
                        {completedCount}/{exercises.length} exercícios
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingWorkout({ id: workout.id, name: workout.name }); }}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(workout.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Exercises */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-primary/10 space-y-3">
                      <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-display px-2 mb-1">
                        <div className="col-span-5">Exercício</div>
                        <div className="col-span-2 text-center">Séries</div>
                        <div className="col-span-2 text-center">Reps</div>
                        <div className="col-span-2 text-center">Peso</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {exercises.map((exercise) => (
                        <div key={exercise.id}>
                          {editingExercise?.id === exercise.id ? (
                            <div className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg border border-primary/30 bg-muted/10">
                              <Input
                                value={editingExercise.name}
                                onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                                className="col-span-5 h-8 text-xs bg-background/50 border-primary/20 font-body"
                              />
                              <Input
                                value={editingExercise.sets || ""}
                                onChange={(e) => setEditingExercise({ ...editingExercise, sets: e.target.value })}
                                className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                              />
                              <Input
                                value={editingExercise.reps || ""}
                                onChange={(e) => setEditingExercise({ ...editingExercise, reps: e.target.value })}
                                className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                              />
                              <Input
                                value={editingExercise.weight || ""}
                                onChange={(e) => setEditingExercise({ ...editingExercise, weight: e.target.value })}
                                className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                              />
                              <div className="col-span-1 flex gap-1">
                                <button onClick={handleSaveExercise} className="text-secondary hover:text-secondary/80"><Save className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setEditingExercise(null)} className="text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          ) : (
                            <div className={cn(
                              "grid grid-cols-12 gap-2 items-center p-2 rounded-lg border transition-all",
                              exercise.completed
                                ? "bg-secondary/10 border-secondary/30"
                                : "bg-muted/10 border-primary/10 hover:border-primary/30"
                            )}>
                              <div className="col-span-5 flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleExercise(exercise.id, exercise.completed)}
                                  className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
                                    exercise.completed
                                      ? "bg-secondary border-secondary text-secondary-foreground"
                                      : "border-primary/40 hover:border-primary"
                                  )}
                                >
                                  {exercise.completed && <Check className="w-3 h-3" />}
                                </button>
                                <span className={cn("text-sm font-body truncate", exercise.completed && "line-through text-muted-foreground")}>
                                  {exercise.name}
                                </span>
                              </div>
                              <div className="col-span-2 text-center text-sm font-body text-foreground">{exercise.sets || "-"}</div>
                              <div className="col-span-2 text-center text-sm font-body text-foreground">{exercise.reps || "-"}</div>
                              <div className="col-span-2 text-center text-sm font-body text-primary">{exercise.weight || "-"}</div>
                              <div className="col-span-1 flex justify-end gap-2">
                                <button onClick={() => setEditingExercise(exercise)} className="text-muted-foreground hover:text-primary transition-colors">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteExercise.mutate(exercise.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add exercise */}
                      <div className="grid grid-cols-12 gap-2 mt-4 pt-4 border-t border-primary/10">
                        <Input
                          placeholder="Novo exercício..."
                          value={newExercise[workout.id]?.name ?? ""}
                          onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { sets: "", reps: "", weight: "" }), name: e.target.value } }))}
                          className="col-span-5 h-8 text-xs bg-background/50 border-primary/20 font-body"
                        />
                        <Input
                          placeholder="Sets"
                          value={newExercise[workout.id]?.sets ?? ""}
                          onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", reps: "", weight: "" }), sets: e.target.value } }))}
                          className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                        />
                        <Input
                          placeholder="Reps"
                          value={newExercise[workout.id]?.reps ?? ""}
                          onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", sets: "", weight: "" }), reps: e.target.value } }))}
                          className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                        />
                        <Input
                          placeholder="Peso"
                          value={newExercise[workout.id]?.weight ?? ""}
                          onChange={(e) => setNewExercise((prev) => ({ ...prev, [workout.id]: { ...(prev[workout.id] || { name: "", sets: "", reps: "" }), weight: e.target.value } }))}
                          className="col-span-2 h-8 text-xs text-center bg-background/50 border-primary/20 font-body"
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleAddExercise(workout.id)} disabled={!newExercise[workout.id]?.name.trim()} className="col-span-1 h-8 w-8 p-0 text-primary">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </HolographicPanel>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
