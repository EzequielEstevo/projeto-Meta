import { useEffect, useState } from "react";

interface GoalCountdownProps {
  deadline: string;
  completed: boolean;
}

export function GoalCountdown({ deadline, completed }: GoalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (completed) {
    return <span className="font-display text-xs text-green-400 uppercase tracking-wider">✓ Concluída</span>;
  }

  if (timeLeft.expired) {
    return <span className="font-display text-xs text-destructive uppercase tracking-wider animate-pulse">Expirada</span>;
  }

  return (
    <div className="flex gap-1.5 items-center">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-muted/50 rounded px-2 py-1 min-w-[40px]">
          <span className="font-display text-sm font-bold text-primary">{timeLeft.days}</span>
          <span className="text-[10px] text-muted-foreground uppercase">dias</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-muted/50 rounded px-2 py-1 min-w-[40px]">
        <span className="font-display text-sm font-bold text-primary">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[10px] text-muted-foreground uppercase">hrs</span>
      </div>
      <div className="flex flex-col items-center bg-muted/50 rounded px-2 py-1 min-w-[40px]">
        <span className="font-display text-sm font-bold text-primary">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[10px] text-muted-foreground uppercase">min</span>
      </div>
      <div className="flex flex-col items-center bg-muted/50 rounded px-2 py-1 min-w-[40px]">
        <span className="font-display text-sm font-bold text-accent animate-pulse">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[10px] text-muted-foreground uppercase">seg</span>
      </div>
    </div>
  );
}
