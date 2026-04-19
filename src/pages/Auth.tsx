import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemAlert } from "@/components/ui/SystemAlert";
import { Swords, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard");
  }, [authLoading, user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { player_name: playerName || "Jogador" },
          },
        });
        if (signUpError) {
          setError(signUpError.message.includes("already registered")
            ? "Este email já está registrado. Faça login."
            : signUpError.message);
          return;
        }
        toast({
          title: "⚔️ Conta Criada!",
          description: "Bem-vindo ao Sistema Sistema. Sua jornada começa agora.",
        });
        navigate("/dashboard");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message.includes("Invalid login credentials")
            ? "Email ou senha inválidos."
            : signInError.message);
          return;
        }
        toast({
          title: "🗡️ Bem-vindo de volta, Jogador!",
          description: "O Sistema aguarda seus comandos.",
        });
        navigate("/dashboard");
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="relative z-10 w-full max-w-md px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-display text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <HolographicPanel glow className="animate-level-up">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center">
                <Swords className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display font-bold text-2xl text-glow-blue mb-2">
              {mode === "login" ? "LOGIN DO SISTEMA" : "REGISTRO DE JOGADOR"}
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {mode === "login"
                ? "Insira suas credenciais para acessar o Sistema"
                : "Crie seu perfil de Jogador para começar a evoluir"}
            </p>
          </div>

          {error && (
            <SystemAlert type="error" title="Falha na Autenticação" message={error} className="mb-6" />
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="playerName" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                  Nome do Jogador
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Seu nome de Jogador"
                    className="pl-10 bg-muted/30 border-primary/30 focus:border-primary font-body"
                    required
                    maxLength={50}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jogador@email.com"
                  className="pl-10 bg-muted/30 border-primary/30 focus:border-primary font-body"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-muted/30 border-primary/30 focus:border-primary font-body"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider h-12"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Acessar Sistema" : "Iniciar Jornada"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/20 text-center">
            <p className="text-sm text-muted-foreground font-body">
              {mode === "login" ? "Novo no Sistema?" : "Já é um Jogador?"}
            </p>
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
              className="mt-2 text-primary hover:text-primary/80 font-display text-sm uppercase tracking-wider transition-colors"
            >
              {mode === "login" ? "Registrar como Jogador" : "Fazer Login"}
            </button>
          </div>
        </HolographicPanel>

        <p className="text-center text-xs text-muted-foreground mt-6 font-display uppercase tracking-widest">
          ━━━ O Sistema Aguarda ━━━
        </p>
      </div>
    </div>
  );
}
