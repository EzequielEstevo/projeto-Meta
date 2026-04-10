import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useMissions, useUpdateMission } from "@/hooks/useMissions";
import { useProgression } from "@/hooks/useProgression";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { PlayerCard } from "@/components/player/PlayerCard";
import { MissionCard } from "@/components/mission/MissionCard";
import { CreateMissionDialog } from "@/components/mission/CreateMissionDialog";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Button } from "@/components/ui/button";
import { Swords, LogOut, Plus, Loader2, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: missions, isLoading: missionsLoading } = useMissions();
  const updateMission = useUpdateMission();
  const { completeMission, isUpdating } = useProgression();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-display text-primary text-glow-blue uppercase tracking-widest">
            Carregando Sistema...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const activeMissions = missions?.filter((m) => m.status !== "completed" && m.status !== "failed") ?? [];
  const completedToday = missions?.filter(
    (m) => m.status === "completed" && m.completed_at &&
    new Date(m.completed_at).toDateString() === new Date().toDateString()
  ).length ?? 0;

  const handleAccept = async (id: string) => {
    await updateMission.mutateAsync({ id, status: "in_progress" });
  };

  const handleComplete = async (mission: typeof missions extends (infer T)[] | undefined ? T : never) => {
    if (!mission) return;
    await updateMission.mutateAsync({ id: mission.id, status: "completed", completed_at: new Date().toISOString() });
    await completeMission(mission, profile);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-primary" />
                <h1 className="font-display font-bold text-2xl text-glow-blue"><h1 className="font-display font-bold text-2xl text-glow-blue">ZENTRA</h1></h1>
              </div>
              <nav className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/routines")} className="font-display text-muted-foreground hover:text-primary">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Rotinas</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-display text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Greeting */}
        <div className="container mx-auto px-4 py-4">
          <SystemAlert
            type="info"
            title={`${greeting()}, ${profile.player_name}!`}
            message={
              activeMissions.length > 0
                ? `Você tem ${activeMissions.length} missão(ões) ativa(s). ${completedToday > 0 ? `Já completou ${completedToday} hoje!` : "Vamos começar!"}`
                : "Crie sua primeira missão e comece a evoluir!"
            }
          />
        </div>

        {/* Main Grid */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Player Card */}
            <div className="lg:col-span-4">
              <PlayerCard
                name={profile.player_name}
                level={profile.level}
                rank={profile.rank as any}
                title={profile.title}
                currentXP={profile.current_xp}
                requiredXP={profile.required_xp}
                avatarUrl={profile.avatar_url}
                stats={{
                  intelligence: profile.intelligence,
                  strength: profile.strength,
                  focus: profile.focus,
                  knowledge: profile.knowledge,
                  discipline: profile.discipline,
                  energy: profile.energy,
                }}
              />
            </div>

            {/* Missions */}
            <div className="lg:col-span-8 space-y-4">
              <HolographicPanel>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl text-foreground">
                    <span className="text-primary">[</span> Suas Missões <span className="text-primary">]</span>
                  </h2>
                  <CreateMissionDialog>
                    <Button className="btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Missão
                    </Button>
                  </CreateMissionDialog>
                </div>

                {missionsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : activeMissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Swords className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="font-display text-muted-foreground uppercase tracking-wider mb-2">
                      Nenhuma missão ativa
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      Crie sua primeira missão para começar a evoluir!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeMissions.map((mission) => (
                      <MissionCard
                        key={mission.id}
                        title={mission.title}
                        description={mission.description ?? ""}
                        rank={mission.rank as any}
                        xpReward={mission.xp_reward}
                        timeSlot={mission.time_slot ?? ""}
                        duration={mission.duration ?? ""}
                        status={mission.status as "available" | "in_progress" | "completed" | "failed"}
                        statRewards={mission.stat_rewards}
                        dueDate={mission.due_date}
                        onAccept={() => handleAccept(mission.id)}
                        onComplete={() => handleComplete(mission)}
                      />
                    ))}
                  </div>
                )}
              </HolographicPanel>

              {/* Completed Today */}
              {completedToday > 0 && (
                <HolographicPanel variant="purple">
                  <h2 className="font-display font-bold text-xl text-foreground mb-2">
                    <span className="text-secondary">[</span> Progresso de Hoje <span className="text-secondary">]</span>
                  </h2>
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg text-secondary">Missões Completadas</h3>
                        <p className="text-sm text-muted-foreground font-body mt-1">Continue assim, Hunter!</p>
                      </div>
                      <span className="font-display font-bold text-3xl text-secondary">{completedToday}</span>
                    </div>
                  </div>
                </HolographicPanel>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-primary/10 bg-background/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground font-display uppercase tracking-widest">
              ━━━ Levante-se e Evolua ━━━
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
