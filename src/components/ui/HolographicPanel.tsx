import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HolographicPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "blue" | "purple" | "cyan";
  glow?: boolean;
  floating?: boolean;
}

export function HolographicPanel({
  children,
  className,
  variant = "blue",
  glow = false,
  floating = false,
}: HolographicPanelProps) {
  const variantStyles = {
    blue: "holographic-panel",
    purple: "holographic-panel-purple",
    cyan: "holographic-panel border-accent/30",
  };

  return (
    <div
      className={cn(
        "relative rounded-lg p-6",
        variantStyles[variant],
        glow && "animate-border-glow",
        floating && "animate-float",
        className
      )}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
      
      {children}
    </div>
  );
}
