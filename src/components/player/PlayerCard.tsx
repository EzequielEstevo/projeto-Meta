import { useRef } from "react";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { RankBadge, type Rank } from "@/components/ui/RankBadge";
import { XPBar } from "@/components/ui/XPBar";
import { StatBar } from "@/components/ui/StatBar";
import { User, Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { FireTagline } from "./FireTagline";

interface PlayerStats {
  intelligence: number;
  strength: number;
  focus: number;
  knowledge: number;
  discipline: number;
  energy: number;
}

interface PlayerCardProps {
  name: string;
  level: number;
  rank: Rank;
  title?: string;
  currentXP: number;
  requiredXP: number;
  stats: PlayerStats;
  avatarUrl?: string | null;
  tagline?: string | null;
  onTaglineSave?: (tagline: string) => void;
  className?: string;
}

export function PlayerCard({
  name,
  level,
  rank,
  title,
  currentXP,
  requiredXP,
  stats,
  avatarUrl,
  className,
}: PlayerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, uploading } = useAvatarUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      uploadAvatar(file);
    }
  };

  return (
    <HolographicPanel className={cn("w-full max-w-md", className)} glow>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className="relative group">
          <div
            className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-primary" />
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Camera className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2">
            <RankBadge rank={rank} size="sm" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Player Info */}
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl text-foreground text-glow-blue">
            {name}
          </h2>
          {title && (
            <p className="text-sm text-secondary font-display uppercase tracking-wider">
              「{title}」
            </p>
          )}
        </div>
      </div>

      {/* XP Bar */}
      <XPBar
        level={level}
        currentXP={currentXP}
        requiredXP={requiredXP}
        className="mb-6"
      />

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Status
        </h3>
        <StatBar stat="intelligence" value={stats.intelligence} size="sm" />
        <StatBar stat="strength" value={stats.strength} size="sm" />
        <StatBar stat="focus" value={stats.focus} size="sm" />
        <StatBar stat="knowledge" value={stats.knowledge} size="sm" />
        <StatBar stat="discipline" value={stats.discipline} size="sm" />
        <StatBar stat="energy" value={stats.energy} size="sm" />
      </div>

      {/* Footer decoration */}
      <div className="mt-6 pt-4 border-t border-primary/20">
        <p className="text-center text-xs text-muted-foreground font-display uppercase tracking-widest">
          ━━━ ZENTRA SYSTEM ━━━
        </p>
      </div>
    </HolographicPanel>
  );
}
