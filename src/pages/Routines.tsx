import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useWeeklyRoutines, useCreateRoutine, useToggleRoutine, useDeleteRoutine } from "@/hooks/useWeeklyRoutines";
import { useProgression } from "@/hooks/useProgression";
import { useDisciplines, useTopics } from "@/hooks/useStudies";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, ArrowLeft, Plus, Loader2, Check, Trash2, Zap, RotateCcw, Pencil, X, Save, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Routines() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: routines, isLoading } = useWeeklyRoutines();
  const { data: disciplines } = useDisciplines();
  const { data: allTopics } = useTopics();
  const createRoutine = useCreateRoutine();
  const toggleRoutine = useToggleRoutine();
  const deleteRoutine = useDeleteRoutine();
  const { completeMission } = useProgression();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newTitles, setNewTitles] = useState<Record<number, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-display text-primary text-glow-blue uppercase tracking-widest">Carregando Rotinas...</p>
        </div>
      </div>
    );
  }

  const handleAdd = async (dayIndex: number) => {
    const title = newTitles[dayIndex]?.trim();
    if (!title) return;
    await createRoutine.mutateAsync({
      title,
      day_of_week: dayIndex,
      xp_reward: 50,
      time_slot: null,
    });
    setNewTitles((prev) => ({ ...prev, [dayIndex]: "" }));
  };

  const handleToggle = async (routine: typeof routines extends (infer T)[] | undefined ? T : never) => {
    if (!routine || !profile) return;
    const newCompleted = !routine.completed;
    await toggleRoutine.mutateAsync({ id: routine.id, completed: newCompleted });

    if (newCompleted) {
      const fakeMission = {
        id: routine.id,
        user_id: routine.user_id,
        title: routine.title,
        description: null,
        rank: "E",
        status: "completed",
        xp_reward: routine.xp_reward,
        time_slot: null,
        duration: null,
        priority: "normal",
        mission_type: "routine",
        stat_rewards: [],
        due_date: null,
        completed_at: new Date().toISOString(),
        created_at: routine.created_at,
      };
      await completeMission(fakeMission, profile);
      toast({
        title: `✅ Rotina Concluída!`,
        description: `+${routine.xp_reward} XP ganhos!`,
      });
    }
  };

  const handleResetDay = async (dayIndex: number) => {
    const dayRoutines = routinesByDay[dayIndex].filter((r) => r.completed);
    if (dayRoutines.length === 0) return;
    for (const r of dayRoutines) {
      await toggleRoutine.mutateAsync({ id: r.id, completed: false });
    }
    toast({ title: "🔄 Rotinas reiniciadas!", description: `${DAYS[dayIndex]} resetado com sucesso.` });
  };

  const startEdit = (routine: { id: string; title: string }) => {
    setEditingId(routine.id);
    setEditTitle(routine.title);
  };

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim()) return;
    const { error } = await supabase
      .from("weekly_routines")
      .update({ title: editTitle.trim() })
      .eq("id", editingId);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["weekly_routines"] });
      toast({ title: "✏️ Rotina atualizada!" });
    }
    setEditingId(null);
  };

  const routinesByDay = DAYS.map((_, i) =>
    routines?.filter((r) => r.day_of_week === i) ?? []
  );

  const getDayProgress = (dayIndex: number) => {
    const dayRoutines = routinesByDay[dayIndex];
    if (dayRoutines.length === 0) return 0;
    return Math.round((dayRoutines.filter((r) => r.completed).length / dayRoutines.length) * 100);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {DAYS.map((day, dayIndex) => {
              const progress = getDayProgress(dayIndex);
              const isComplete = progress === 100 && routinesByDay[dayIndex].length > 0;
              const hasCompleted = routinesByDay[dayIndex].some((r) => r.completed);

              return (
                <HolographicPanel key={day} variant={isComplete ? "purple" : "blue"} glow={isComplete} className="flex flex-col">
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-bold text-lg text-foreground">
                      <span className="text-primary">[</span> {day} <span className="text-primary">]</span>
                    </h2>
                    <div className="flex items-center gap-1">
                      {hasCompleted && (
                        <button
                          onClick={() => handleResetDay(dayIndex)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                          title="Reiniciar rotinas do dia"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {routinesByDay[dayIndex].length > 0 && (
                        <span className={cn(
                          "text-xs font-display px-2 py-1 rounded",
                          isComplete
                            ? "bg-secondary/20 text-secondary border border-secondary/30"
                            : "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {progress}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {routinesByDay[dayIndex].length > 0 && (
                    <div className="w-full h-1.5 rounded-full bg-muted/30 mb-3 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", isComplete ? "bg-secondary" : "bg-primary")}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Routine items */}
                  <div className="space-y-2 flex-1">
                    {routinesByDay[dayIndex].map((routine) => (
                      <div key={routine.id}>
                        {editingId === routine.id ? (
                          <div className="flex items-center gap-2 mb-2 p-2 rounded border border-primary/30 bg-muted/10">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 h-7 text-xs bg-background/50 border-primary/20 font-body"
                              autoFocus
                              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            />
                            <button onClick={saveEdit} className="text-secondary hover:text-secondary/80 transition-colors">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg border transition-all",
                              routine.completed
                                ? "bg-secondary/10 border-secondary/30"
                                : "bg-muted/10 border-primary/10 hover:border-primary/30"
                            )}
                          >
                            <button
                              onClick={() => handleToggle(routine)}
                              className={cn(
                                "w-6 h-6 rounded flex items-center justify-center border-2 transition-all shrink-0",
                                routine.completed
                                  ? "bg-secondary border-secondary text-secondary-foreground"
                                  : "border-primary/40 hover:border-primary"
                              )}
                            >
                              {routine.completed && <Check className="w-4 h-4" />}
                            </button>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className={cn("text-sm font-body", routine.completed && "line-through text-muted-foreground")}>
                                {routine.title}
                              </span>
                              {routine.time_slot && (
                                <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {routine.time_slot}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-primary font-display flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {routine.xp_reward}
                            </span>
                            <button onClick={() => startEdit(routine)} className="text-muted-foreground hover:text-primary transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteRoutine.mutate(routine.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add new routine */}
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <div className="flex gap-1">
                      <Input
                        placeholder="Nova rotina..."
                        value={newTitles[dayIndex] ?? ""}
                        onChange={(e) => setNewTitles((prev) => ({ ...prev, [dayIndex]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(dayIndex)}
                        className="h-8 text-xs bg-background/50 border-primary/20 font-body"
                      />
                      <Button size="sm" onClick={() => handleAdd(dayIndex)} disabled={!newTitles[dayIndex]?.trim()} className="h-8 w-8 p-0">
                        <Plus className="w-4 h-4" />
                      </Button>
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
