import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RankBadge, type Rank } from "@/components/ui/RankBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Zap, CheckCircle, AlertTriangle, Timer, ListChecks, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubtasks, useToggleSubtask, type Mission } from "@/hooks/useMissions";

interface MissionDetailDialogProps {
  mission: Mission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  onComplete?: () => void;
}

const statusConfig = {
  available: { label: "DISPONÍVEL", color: "text-primary", bg: "bg-primary/10" },
  in_progress: { label: "EM PROGRESSO", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  completed: { label: "COMPLETA", color: "text-green-400", bg: "bg-green-400/10" },
  failed: { label: "FALHOU", color: "text-destructive", bg: "bg-destructive/10" },
};

export function MissionDetailDialog({ mission, open, onOpenChange, onAccept, onComplete }: MissionDetailDialogProps) {
  const { data: subtasks, isLoading: subtasksLoading } = useSubtasks(mission.id);
  const toggleSubtask = useToggleSubtask();
  const status = mission.status as keyof typeof statusConfig;
  const statusInfo = statusConfig[status] ?? statusConfig.available;

  const completedSubtasks = subtasks?.filter((s) => s.completed).length ?? 0;
  const totalSubtasks = subtasks?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/30 max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <RankBadge rank={mission.rank as Rank} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-xs font-display uppercase tracking-wider px-2 py-0.5 rounded", statusInfo.bg, statusInfo.color)}>
                  {statusInfo.label}
                </span>
              </div>
              <DialogTitle className="font-display font-bold text-xl text-foreground">
                {mission.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Description */}
        {mission.description && (
          <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-primary/10">
            <p className="text-sm text-muted-foreground font-body leading-relaxed whitespace-pre-wrap">
              {mission.description}
            </p>
          </div>
        )}

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          {mission.time_slot && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-body">{mission.time_slot}</span>
            </div>
          )}
          {mission.duration && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="font-body">{mission.duration}</span>
            </div>
          )}
          {mission.due_date && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-body">{new Date(mission.due_date).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 mt-4 p-3 rounded-lg bg-muted/30 border border-primary/10">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-primary">+{mission.xp_reward} XP</span>
          </div>
          {mission.stat_rewards && mission.stat_rewards.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {mission.stat_rewards.map((reward, i) => (
                <span key={i} className="text-xs text-accent font-display">
                  +{reward.value} {reward.stat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground">
              Sub-missões
            </h3>
            {totalSubtasks > 0 && (
              <span className="text-xs text-muted-foreground font-display">
                ({completedSubtasks}/{totalSubtasks})
              </span>
            )}
          </div>

          {subtasksLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          ) : totalSubtasks === 0 ? (
            <p className="text-sm text-muted-foreground font-body py-4 text-center">
              Nenhuma sub-missão cadastrada.
            </p>
          ) : (
            <div className="space-y-2">
              {subtasks?.map((subtask) => (
                <label
                  key={subtask.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    subtask.completed
                      ? "bg-green-400/5 border-green-400/20"
                      : "bg-muted/10 border-primary/10 hover:border-primary/30"
                  )}
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={(checked) =>
                      toggleSubtask.mutate({ id: subtask.id, completed: !!checked })
                    }
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span
                    className={cn(
                      "text-sm font-body flex-1",
                      subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {totalSubtasks > 0 && (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {status === "available" && onAccept && (
            <Button
              onClick={() => { onAccept(); onOpenChange(false); }}
              className="flex-1 btn-glow bg-gradient-to-r from-primary to-accent text-primary-foreground font-display uppercase tracking-wider"
            >
              Aceitar Missão
            </Button>
          )}
          {status === "in_progress" && onComplete && (
            <Button
              onClick={() => { onComplete(); onOpenChange(false); }}
              className="flex-1 btn-glow bg-gradient-to-r from-secondary to-purple-500 text-secondary-foreground font-display uppercase tracking-wider"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completar Missão
            </Button>
          )}
          {status === "completed" && (
            <div className="flex-1 flex items-center justify-center gap-2 text-green-400 font-display uppercase tracking-wider py-2">
              <CheckCircle className="w-5 h-5" />
              Missão Completa
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}