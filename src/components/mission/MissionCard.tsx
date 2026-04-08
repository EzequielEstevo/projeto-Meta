import { useState, useEffect } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { RankBadge, type Rank } from "@/components/ui/RankBadge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, CheckCircle, AlertTriangle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

type MissionStatus = "available" | "in_progress" | "completed" | "failed";
type MissionRank = Rank;

interface MissionCardProps {
  title: string;
  description: string;
  rank: MissionRank;
  xpReward: number;
  timeSlot: string;
  duration: string;
  status: MissionStatus;
  dueDate?: string | null;
  statRewards?: { stat: string; value: number }[];
  onAccept?: () => void;
  onComplete?: () => void;
  className?: string;
}

const statusConfig = {
  available: {
    label: "DISPONÍVEL",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  in_progress: {
    label: "EM PROGRESSO",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  completed: {
    label: "COMPLETA",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  failed: {
    label: "FALHOU",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

function useCountdown(targetDate: string | null | undefined, active: boolean) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!targetDate || !active) return;

    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, active]);

  return timeLeft;
}

function CountdownDisplay({ dueDate, status }: { dueDate: string; status: MissionStatus }) {
  const active = status === "available" || status === "in_progress";
  const { days, hours, minutes, seconds, expired } = useCountdown(dueDate, active);

  if (!active) return null;

  const isUrgent = !expired && days === 0 && hours < 3;
  const isCritical = !expired && days === 0 && hours === 0 && minutes < 30;

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border font-display text-sm",
        expired
          ? "bg-destructive/10 border-destructive/30 text-destructive"
          : isCritical
          ? "bg-destructive/10 border-destructive/30 text-destructive animate-pulse"
          : isUrgent
          ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
          : "bg-primary/10 border-primary/30 text-primary"
      )}
    >
      <Timer className="w-4 h-4" />
      {expired ? (
        <span className="uppercase tracking-wider text-xs font-bold">⚠ Tempo Esgotado!</span>
      ) : (
        <div className="flex items-center gap-1">
          {days > 0 && (
            <span className="font-bold">{days}<span className="text-xs opacity-70">d</span></span>
          )}
          <span className="font-bold tabular-nums">{String(hours).padStart(2, "0")}</span>
          <span className="opacity-50 animate-pulse">:</span>
          <span className="font-bold tabular-nums">{String(minutes).padStart(2, "0")}</span>
          <span className="opacity-50 animate-pulse">:</span>
          <span className="font-bold tabular-nums">{String(seconds).padStart(2, "0")}</span>
        </div>
      )}
    </div>
  );
}

export function MissionCard({
  title,
  description,
  rank,
  xpReward,
  timeSlot,
  duration,
  status,
  dueDate,
  statRewards,
  onAccept,
  onComplete,
  className,
}: MissionCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <HolographicPanel
      className={cn(
        "mission-card w-full",
        status === "completed" && "opacity-70",
        status === "failed" && "opacity-50",
        className
      )}
      variant={status === "in_progress" ? "purple" : "blue"}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-display uppercase tracking-wider px-2 py-0.5 rounded", statusInfo.bg, statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-foreground">
            {title}
          </h3>
        </div>
        <RankBadge rank={rank} size="sm" />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground font-body mb-4">
        {description}
      </p>

      {/* Countdown Timer */}
      {dueDate && (
        <div className="mb-4">
          <CountdownDisplay dueDate={dueDate} status={status} />
        </div>
      )}

      {/* Time & Duration */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {timeSlot && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-body">{timeSlot}</span>
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-body">{duration}</span>
          </div>
        )}
      </div>

      {/* Rewards */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/30 border border-primary/10">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-primary">+{xpReward} XP</span>
        </div>
        {statRewards && statRewards.length > 0 && (
          <div className="flex gap-2">
            {statRewards.map((reward, index) => (
              <span key={index} className="text-xs text-accent font-display">
                +{reward.value} {reward.stat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {status === "available" && onAccept && (
        <Button
          onClick={onAccept}
          className="w-full btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider"
        >
          Aceitar Missão
        </Button>
      )}
      {status === "in_progress" && onComplete && (
        <Button
          onClick={onComplete}
          className="w-full btn-glow bg-gradient-to-r from-secondary to-purple-500 text-secondary-foreground font-display uppercase tracking-wider"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completar Missão
        </Button>
      )}
      {status === "completed" && (
        <div className="flex items-center justify-center gap-2 text-green-400 font-display uppercase tracking-wider">
          <CheckCircle className="w-5 h-5" />
          Missão Completa
        </div>
      )}
    </HolographicPanel>
  );
}
