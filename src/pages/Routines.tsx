import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useWeeklyRoutines, useCreateRoutine, useToggleRoutine, useDeleteRoutine } from "@/hooks/useWeeklyRoutines";
import { useProgression } from "@/hooks/useProgression";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, ArrowLeft, Plus, Loader2, Check, Trash2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Routines() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: routines, isLoading } = useWeeklyRoutines();
  const createRoutine = useCreateRoutine();
  const toggleRoutine = useToggleRoutine();
  const deleteRoutine = useDeleteRoutine();
  const { completeMission } = useProgression();
  const { toast } = useToast();

  const [newTitles, setNewTitles] = useState<Record<number, string>>({});
  const [xpValues, setXpValues] = useState<Record<number, number>>({});

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
      xp_reward: xpValues[dayIndex] || 50,
    });
    setNewTitles((prev) => ({ ...prev, [dayIndex]: "" }));
    setXpValues((prev) => ({ ...prev, [dayIndex]: 50 }));
  };

  const handleToggle = async (routine: typeof routines extends (infer T)[] | undefined ? T : never) => {
    if (!routine || !profile) return;
    const newCompleted = !routine.completed;
    await toggleRoutine.mutateAsync({ id: routine.id, completed: newCompleted });

    if (newCompleted) {
      // Give XP via progression system
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
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-primary" />
                <h1 className="font-display font-bold text-2xl text-glow-blue">ROTINA SEMANAL</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="font-display text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {DAYS.map((day, dayIndex) => {
              const progress = getDayProgress(dayIndex);
              const isComplete = progress === 100 && routinesByDay[dayIndex].length > 0;

              return (
                <HolographicPanel
                  key={day}
                  variant={isComplete ? "purple" : "blue"}
                  glow={isComplete}
                  className="flex flex-col"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display font-bold text-lg text-foreground">
                      <span className="text-primary">[</span> {day} <span className="text-primary">]</span>
                    </h2>
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

                  {/* Progress bar */}
                  {routinesByDay[dayIndex].length > 0 && (
                    <div className="w-full h-1.5 rounded-full bg-muted/30 mb-3 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isComplete ? "bg-secondary" : "bg-primary"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Routine items */}
                  <div className="space-y-2 flex-1">
                    {routinesByDay[dayIndex].map((routine) => (
                      <div
                        key={routine.id}
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
                        <span className={cn(
                          "flex-1 text-sm font-body",
                          routine.completed && "line-through text-muted-foreground"
                        )}>
                          {routine.title}
                        </span>
                        <span className="text-xs text-primary font-display flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {routine.xp_reward}
                        </span>
                        <button
                          onClick={() => deleteRoutine.mutate(routine.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new routine */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-primary/10">
                    <Input
                      placeholder="Nova rotina..."
                      value={newTitles[dayIndex] ?? ""}
                      onChange={(e) => setNewTitles((prev) => ({ ...prev, [dayIndex]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd(dayIndex)}
                      className="flex-1 h-8 text-sm bg-background/50 border-primary/20 font-body"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAdd(dayIndex)}
                      disabled={!newTitles[dayIndex]?.trim()}
                      className="h-8 w-8 p-0 text-primary hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
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
