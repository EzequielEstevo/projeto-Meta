import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              player_name: playerName,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("This email is already registered. Please login instead.");
          } else {
            setError(signUpError.message);
          }
          return;
        }

        toast({
          title: "Account Created!",
          description: "Welcome to the Solo Leveling System. Your journey begins now.",
        });
        navigate("/");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else {
            setError(signInError.message);
          }
          return;
        }

        toast({
          title: "Welcome Back, Hunter!",
          description: "The System awaits your commands.",
        });
        navigate("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-display text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <HolographicPanel glow className="animate-level-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center">
                <Swords className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display font-bold text-2xl text-glow-blue mb-2">
              {mode === "login" ? "SYSTEM LOGIN" : "HUNTER REGISTRATION"}
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {mode === "login"
                ? "Enter your credentials to access the System"
                : "Create your hunter profile to begin leveling"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <SystemAlert
              type="error"
              title="Authentication Failed"
              message={error}
              className="mb-6"
            />
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="playerName" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                  Hunter Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your hunter name"
                    className="pl-10 bg-muted/30 border-primary/30 focus:border-primary font-body"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hunter@example.com"
                  className="pl-10 bg-muted/30 border-primary/30 focus:border-primary font-body"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Password
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
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? (
                "Access System"
              ) : (
                "Begin Journey"
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t border-primary/20 text-center">
            <p className="text-sm text-muted-foreground font-body">
              {mode === "login" ? "New to the System?" : "Already a Hunter?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="mt-2 text-primary hover:text-primary/80 font-display text-sm uppercase tracking-wider transition-colors"
            >
              {mode === "login" ? "Register as Hunter" : "Login to System"}
            </button>
          </div>
        </HolographicPanel>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-display uppercase tracking-widest">
          ━━━ The System Awaits ━━━
        </p>
      </div>
    </div>
  );
}
