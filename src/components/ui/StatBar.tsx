import { cn } from "@/lib/utils";
import { Brain, Flame, Focus, Dumbbell, BookOpen, Zap } from "lucide-react";

type StatType = "intelligence" | "strength" | "focus" | "knowledge" | "discipline" | "energy";

interface StatBarProps {
  stat: StatType;
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statConfig = {
  intelligence: {
    icon: Brain,
    label: "Intelligence",
    gradient: "stat-bar-intelligence",
    color: "text-primary",
  },
  strength: {
    icon: Dumbbell,
    label: "Strength",
    gradient: "stat-bar-strength",
    color: "text-orange-400",
  },
  focus: {
    icon: Focus,
    label: "Focus",
    gradient: "stat-bar-focus",
    color: "text-secondary",
  },
  knowledge: {
    icon: BookOpen,
    label: "Knowledge",
    gradient: "stat-bar-knowledge",
    color: "text-yellow-400",
  },
  discipline: {
    icon: Flame,
    label: "Discipline",
    gradient: "stat-bar-discipline",
    color: "text-red-400",
  },
  energy: {
    icon: Zap,
    label: "Energy",
    gradient: "stat-bar-energy",
    color: "text-green-400",
  },
};

const sizeConfig = {
  sm: { bar: "h-2", icon: "w-4 h-4", text: "text-xs" },
  md: { bar: "h-3", icon: "w-5 h-5", text: "text-sm" },
  lg: { bar: "h-4", icon: "w-6 h-6", text: "text-base" },
};

export function StatBar({
  stat,
  value,
  maxValue = 100,
  showLabel = true,
  size = "md",
  className,
}: StatBarProps) {
  const config = statConfig[stat];
  const sizes = sizeConfig[size];
  const Icon = config.icon;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn(sizes.icon, config.color)} />
            <span className={cn("font-display font-medium uppercase tracking-wider", sizes.text, config.color)}>
              {config.label}
            </span>
          </div>
          <span className={cn("font-display font-bold", sizes.text, config.color)}>
            {value}
          </span>
        </div>
      )}
      <div className={cn("relative w-full rounded-full bg-muted/50 overflow-hidden", sizes.bar)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config.gradient,
            "shadow-[0_0_10px_currentColor]"
          )}
          style={{ width: `${percentage}%` }}
        />
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );
}
