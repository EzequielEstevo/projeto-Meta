import { cn } from "@/lib/utils";

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  className?: string;
}

export function XPBar({ currentXP, requiredXP, level, className }: XPBarProps) {
  const percentage = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/50">
            <span className="font-display font-bold text-primary text-lg">{level}</span>
          </div>
          <div>
            <span className="font-display text-xs text-muted-foreground uppercase tracking-wider">Level</span>
          </div>
        </div>
        <span className="font-display text-sm text-primary">
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>
      
      <div className="relative h-4 rounded-full bg-muted/50 overflow-hidden border border-primary/20">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" />
        
        {/* XP Fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out shadow-[0_0_15px_hsl(var(--neon-blue)/0.5)]"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
        
        {/* Level markers */}
        <div className="absolute inset-0 flex">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-primary/30"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
