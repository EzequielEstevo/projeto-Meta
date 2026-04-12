import { Trash2, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalCountdown } from "./GoalCountdown";
import type { Goal } from "@/hooks/useGoals";

interface FireGoalCardProps {
  goal: Goal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FireGoalCard({ goal, onComplete, onDelete }: FireGoalCardProps) {
  return (
    <div className={`fire-goal-card group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
      goal.completed ? "opacity-60" : ""
    }`}>
      {/* Animated fire background */}
      {!goal.completed && (
        <>
          <div className="fire-ember fire-ember-1" />
          <div className="fire-ember fire-ember-2" />
          <div className="fire-ember fire-ember-3" />
          <div className="fire-glow" />
        </>
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Flame className={`w-4 h-4 shrink-0 ${goal.completed ? "text-muted-foreground" : "text-orange-400 fire-icon-animate"}`} />
            <h3 className={`font-display font-bold text-sm truncate ${
              goal.completed ? "line-through text-muted-foreground" : "fire-text"
            }`}>
              {goal.title}
            </h3>
          </div>
          <GoalCountdown deadline={goal.deadline} completed={goal.completed} />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!goal.completed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
              onClick={() => onComplete(goal.id)}
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
