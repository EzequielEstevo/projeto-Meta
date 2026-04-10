import { useState, useRef, useEffect } from "react";
import { Flame, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FireTaglineProps {
  tagline: string | null;
  onSave: (tagline: string) => void;
}

const MAX_LENGTH = 60;
const MARQUEE_THRESHOLD = 25;

export function FireTagline({ tagline, onSave }: FireTaglineProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(tagline ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = value.trim();
    onSave(trimmed);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(tagline ?? "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <Flame className="w-3 h-3 text-destructive shrink-0 animate-pulse" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Sua frase de poder..."
          className="bg-transparent border-b border-destructive/50 text-sm font-body text-destructive outline-none w-full placeholder:text-destructive/30"
          maxLength={MAX_LENGTH}
        />
        <button onClick={handleSave} className="text-green-500 hover:text-green-400 transition-colors">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const displayText = tagline || null;
  const isLong = (displayText?.length ?? 0) > MARQUEE_THRESHOLD;

  return (
    <div
      className="flex items-center gap-1.5 mt-1 group cursor-pointer"
      onClick={() => setEditing(true)}
    >
      <Flame className="w-3 h-3 text-destructive shrink-0 fire-text" />
      {displayText ? (
        <div className="overflow-hidden max-w-[180px] relative">
          <span
            className={cn(
              "text-xs font-body font-semibold fire-text whitespace-nowrap inline-block",
              isLong && "animate-marquee"
            )}
          >
            {displayText}
          </span>
        </div>
      ) : (
        <span className="text-xs font-body text-muted-foreground/50 italic group-hover:text-destructive/60 transition-colors">
          Adicionar frase...
        </span>
      )}
      <Pencil className="w-2.5 h-2.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
