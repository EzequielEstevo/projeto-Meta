import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Button } from "@/components/ui/button";
import { Swords, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ParticleBackground />
        <Loader2 className="relative z-10 w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-2xl px-4">
        <HolographicPanel glow className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center">
              <Swords className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="font-display font-bold text-4xl text-glow-blue mb-2">
            ZENTRA
          </h1>
          <p className="font-display text-secondary uppercase tracking-widest text-sm mb-6">
            Sistema de Rotina Gamificado
          </p>

          <SystemAlert
            type="info"
            title="Sistema Detectado"
            message="Você foi selecionado como Hunter. Crie sua conta para começar sua jornada de evolução."
            className="mb-8 text-left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/auth">
              <Button className="w-full btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider h-14 text-lg">
                <LogIn className="w-5 h-5 mr-2" />
                Entrar
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10 font-display uppercase tracking-wider h-14 text-lg">
                <UserPlus className="w-5 h-5 mr-2" />
                Registrar
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: "🗡️", label: "Missões Diárias", desc: "Quests personalizadas" },
              { icon: "📊", label: "Evolução Real", desc: "Stats e ranking" },
              { icon: "🤖", label: "IA Adaptativa", desc: "Rotina inteligente" },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 border border-primary/10 text-center">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-display text-xs text-foreground mt-1">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </HolographicPanel>

        <p className="text-center text-xs text-muted-foreground mt-6 font-display uppercase tracking-widest">
          ━━━ Levante-se e Evolua ━━━
        </p>
      </div>
    </div>
  );
}
