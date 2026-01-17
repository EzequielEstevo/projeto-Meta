import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { RankBadge } from "@/components/ui/RankBadge";
import { Button } from "@/components/ui/button";
import { Clock, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type MissionStatus = "available" | "in_progress" | "completed" | "failed";
type MissionRank = "E" | "D" | "C" | "B" | "A" | "S";

interface MissionCardProps {
  title: string;
  description: string;
  rank: MissionRank;
  xpReward: number;
  timeSlot: string;
  duration: string;
  status: MissionStatus;
  statRewards?: { stat: string; value: number }[];
  onAccept?: () => void;
  onComplete?: () => void;
  className?: string;
}

const statusConfig = {
  available: {
    label: "AVAILABLE",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  in_progress: {
    label: "IN PROGRESS",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  completed: {
    label: "COMPLETED",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  failed: {
    label: "FAILED",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function MissionCard({
  title,
  description,
  rank,
  xpReward,
  timeSlot,
  duration,
  status,
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

      {/* Time & Duration */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-body">{timeSlot}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-body">{duration}</span>
        </div>
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
          Accept Quest
        </Button>
      )}
      {status === "in_progress" && onComplete && (
        <Button
          onClick={onComplete}
          className="w-full btn-glow bg-gradient-to-r from-secondary to-purple-500 text-secondary-foreground font-display uppercase tracking-wider"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Quest
        </Button>
      )}
      {status === "completed" && (
        <div className="flex items-center justify-center gap-2 text-green-400 font-display uppercase tracking-wider">
          <CheckCircle className="w-5 h-5" />
          Quest Completed
        </div>
      )}
    </HolographicPanel>
  );
}
