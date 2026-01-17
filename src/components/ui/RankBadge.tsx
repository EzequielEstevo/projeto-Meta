import { cn } from "@/lib/utils";

type Rank = "E" | "D" | "C" | "B" | "A" | "S";

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const rankConfig: Record<Rank, { color: string; bg: string; border: string; label: string; glow?: boolean }> = {
  E: { color: "rank-e", bg: "bg-gray-500/20", border: "border-gray-500/50", label: "E-Rank" },
  D: { color: "rank-d", bg: "bg-orange-500/20", border: "border-orange-500/50", label: "D-Rank" },
  C: { color: "rank-c", bg: "bg-yellow-500/20", border: "border-yellow-500/50", label: "C-Rank" },
  B: { color: "rank-b", bg: "bg-green-500/20", border: "border-green-500/50", label: "B-Rank" },
  A: { color: "rank-a", bg: "bg-secondary/20", border: "border-secondary/50", label: "A-Rank" },
  S: { color: "rank-s", bg: "bg-primary/20", border: "border-primary/50", label: "S-Rank", glow: true },
};

const sizeConfig = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-3xl",
};

export function RankBadge({ rank, size = "md", showLabel = false, className }: RankBadgeProps) {
  const config = rankConfig[rank];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 font-display font-bold",
          sizeConfig[size],
          config.bg,
          config.border,
          config.color,
          config.glow && "animate-pulse-glow shadow-[0_0_20px_hsl(var(--neon-blue)/0.5)]"
        )}
      >
        {rank}
        {/* Corner accents for S-Rank */}
        {rank === "S" && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "1s" }} />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
          </>
        )}
      </div>
      {showLabel && (
        <span className={cn("font-display text-xs uppercase tracking-wider", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
