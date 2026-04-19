import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGoals, useUpdateGoal, useDeleteGoal } from "@/hooks/useGoals";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { FireGoalCard } from "@/components/goals/FireGoalCard";
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, LogOut, ArrowLeft, Plus, Loader2, Target, Flame } from "lucide-react";

export default function Goals() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: goals, isLoading } = useGoals();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
    );
  }

  const handleComplete = (id: string) => updateGoal.mutate({ id, completed: true });
  const handleDelete = (id: string) => deleteGoal.mutate(id);

  const filterGoals = (type: string) => goals?.filter((g) => g.goal_type === type) ?? [];

  const GoalList = ({ type }: { type: string }) => {
    const filtered = filterGoals(type);
    const active = filtered.filter((g) => !g.completed);
    const completed = filtered.filter((g) => g.completed);

    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-display text-muted-foreground uppercase tracking-wider mb-2">Nenhuma meta</p>
          <p className="text-sm text-muted-foreground font-body">Crie sua primeira meta e comece a queimar!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {active.map((goal) => (
          <FireGoalCard key={goal.id} goal={goal} onComplete={handleComplete} onDelete={handleDelete} />
        ))}
        {completed.length > 0 && (
          <>
            <p className="font-display text-xs text-muted-foreground uppercase tracking-wider pt-4">Concluídas</p>
            {completed.map((goal) => (
              <FireGoalCard key={goal.id} goal={goal} onComplete={handleComplete} onDelete={handleDelete} />
            ))}
          </>
        )}
      </div>
    );
  };

  const typeLabels: Record<string, string> = { 
    weekly: "Semanais", 
    monthly: "Mensais", 
    six_months: "6 Meses", 
    one_year: "Anuais" 
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Swords className="w-8 h-8 text-primary" />
              <h1 className="font-display font-bold text-2xl text-glow-blue">ZENTRA</h1>
            </div>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="font-display text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/auth"); }} className="font-display text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-orange-400 fire-icon-animate" />
            <h2 className="font-display font-bold text-xl fire-text">Suas Metas</h2>
          </div>

          <Tabs defaultValue="weekly">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50 border border-primary/20">
                <TabsTrigger value="weekly" className="font-display text-[10px] sm:text-xs data-[state=active]:text-orange-400">🔥 Semanais</TabsTrigger>
                <TabsTrigger value="monthly" className="font-display text-[10px] sm:text-xs data-[state=active]:text-orange-400">🔥 Mensais</TabsTrigger>
                <TabsTrigger value="six_months" className="font-display text-[10px] sm:text-xs data-[state=active]:text-orange-400">🔥 6 Meses</TabsTrigger>
                <TabsTrigger value="one_year" className="font-display text-[10px] sm:text-xs data-[state=active]:text-orange-400">🔥 1 Ano</TabsTrigger>
              </TabsList>
              <CreateGoalDialog>
                <Button className="btn-glow bg-gradient-to-r from-orange-500 to-red-500 text-foreground font-display uppercase tracking-wider text-[10px] sm:text-xs">
                  <Plus className="w-4 h-4 mr-1" /> Meta
                </Button>
              </CreateGoalDialog>
            </div>

            {["weekly", "monthly", "six_months", "one_year"].map((type) => (
              <TabsContent key={type} value={type}>
                <HolographicPanel>
                  <h3 className="font-display font-bold text-lg mb-4">
                    <span className="text-orange-400">[</span> Metas {typeLabels[type]} <span className="text-orange-400">]</span>
                  </h3>
                  <GoalList type={type} />
                </HolographicPanel>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
