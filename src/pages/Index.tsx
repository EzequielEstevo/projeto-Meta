import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { PlayerCard } from "@/components/player/PlayerCard";
import { MissionCard } from "@/components/mission/MissionCard";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Button } from "@/components/ui/button";
import { Swords, Calendar, Trophy, Settings, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

// Demo data for showcase
const demoPlayer = {
  name: "Shadow Hunter",
  level: 24,
  rank: "B" as const,
  title: "The Awakened",
  currentXP: 3420,
  requiredXP: 5000,
  stats: {
    intelligence: 45,
    strength: 62,
    focus: 38,
    knowledge: 51,
    discipline: 55,
    energy: 70,
  },
};

const demoMissions = [
  {
    title: "Morning Training Protocol",
    description: "Complete 30 minutes of physical exercise to start the day with maximum energy.",
    rank: "D" as const,
    xpReward: 150,
    timeSlot: "06:00 - 06:30",
    duration: "30 min",
    status: "available" as const,
    statRewards: [{ stat: "STR", value: 2 }, { stat: "ENR", value: 3 }],
  },
  {
    title: "Knowledge Acquisition",
    description: "Study for 2 hours on your main skill development area.",
    rank: "C" as const,
    xpReward: 300,
    timeSlot: "09:00 - 11:00",
    duration: "2 hours",
    status: "in_progress" as const,
    statRewards: [{ stat: "INT", value: 5 }, { stat: "KNW", value: 4 }],
  },
  {
    title: "Focus Enhancement",
    description: "Complete a deep work session without any distractions.",
    rank: "B" as const,
    xpReward: 450,
    timeSlot: "14:00 - 16:00",
    duration: "2 hours",
    status: "available" as const,
    statRewards: [{ stat: "FCS", value: 6 }, { stat: "DSC", value: 3 }],
  },
];

export default function Index() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-primary" />
                <h1 className="font-display font-bold text-2xl text-glow-blue">
                  SOLO LEVELING
                </h1>
              </div>
              <nav className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="font-display text-muted-foreground hover:text-primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="ghost" size="sm" className="font-display text-muted-foreground hover:text-primary">
                  <Trophy className="w-4 h-4 mr-2" />
                  Achievements
                </Button>
                <Button variant="ghost" size="sm" className="font-display text-muted-foreground hover:text-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Link to="/auth">
                  <Button className="btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* System Alert */}
        <div className="container mx-auto px-4 py-4">
          <SystemAlert
            type="info"
            title="Daily Quest Available"
            message="A new set of daily quests has been generated. Complete them to gain XP and increase your stats!"
          />
        </div>

        {/* Main Grid */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Player Profile - Left Column */}
            <div className="lg:col-span-4">
              <PlayerCard {...demoPlayer} />
            </div>

            {/* Missions - Right Column */}
            <div className="lg:col-span-8 space-y-4">
              <HolographicPanel>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl text-foreground">
                    <span className="text-primary">[</span> Daily Quests <span className="text-primary">]</span>
                  </h2>
                  <span className="text-sm text-muted-foreground font-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {demoMissions.map((mission, index) => (
                    <MissionCard
                      key={index}
                      {...mission}
                      onAccept={() => console.log("Accepted:", mission.title)}
                      onComplete={() => console.log("Completed:", mission.title)}
                    />
                  ))}
                </div>
              </HolographicPanel>

              {/* Weekly Challenge Preview */}
              <HolographicPanel variant="purple">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  <span className="text-secondary">[</span> Weekly Challenge <span className="text-secondary">]</span>
                </h2>
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-secondary">
                        Consistency King
                      </h3>
                      <p className="text-sm text-muted-foreground font-body mt-1">
                        Complete all daily quests for 7 consecutive days
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-xl text-secondary">3/7</span>
                      <p className="text-xs text-muted-foreground">Days</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-secondary to-purple-400" />
                  </div>
                </div>
              </HolographicPanel>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/10 bg-background/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground font-display uppercase tracking-widest">
              ━━━ Arise and Level Up ━━━
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
