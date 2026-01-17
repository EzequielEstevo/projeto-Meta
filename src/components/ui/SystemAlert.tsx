import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface SystemAlertProps {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    borderColor: "border-primary/50",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    glowColor: "shadow-[0_0_20px_hsl(var(--neon-blue)/0.3)]",
  },
  success: {
    icon: CheckCircle,
    borderColor: "border-green-500/50",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
    glowColor: "shadow-[0_0_20px_hsl(120_60%_50%/0.3)]",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-yellow-500/50",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    glowColor: "shadow-[0_0_20px_hsl(45_100%_50%/0.3)]",
  },
  error: {
    icon: XCircle,
    borderColor: "border-destructive/50",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    glowColor: "shadow-[0_0_20px_hsl(0_84%_60%/0.3)]",
  },
};

export function SystemAlert({ type, title, message, className }: SystemAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4",
        config.borderColor,
        config.bgColor,
        config.glowColor,
        "animate-system-alert",
        className
      )}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 scan-line pointer-events-none" />
      
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5", config.textColor)} />
        <div className="flex-1">
          <h4 className={cn("font-display font-semibold text-sm uppercase tracking-wider", config.textColor)}>
            [SYSTEM] {title}
          </h4>
          {message && (
            <p className="mt-1 text-sm text-muted-foreground font-body">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
