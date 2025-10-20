import { cn } from "@/lib/utils";

interface ParticipantCardProps {
  name: string;
  isSpeaking?: boolean;
  muted?: boolean;
  background?: string;
}

const fallbackGradient = "from-slate-700 via-slate-800 to-slate-900";

export function ParticipantCard({
  name,
  isSpeaking,
  muted,
  background,
}: ParticipantCardProps) {
  // Generate initials from name
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <div
      className={cn(
        "relative flex h-14 w-full items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-r p-3 shadow-md",
        background ? `bg-gradient-to-r ${background}` : `bg-gradient-to-r ${fallbackGradient}`,
        isSpeaking ? "ring-1 ring-emerald-400 ring-offset-1 ring-offset-black/40" : ""
      )}
    >
      {/* Avatar */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <span className="text-sm font-semibold text-white drop-shadow-lg">{initials}</span>
        {isSpeaking && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-1 ring-black/40" />
        )}
      </div>
      
      {/* Name and Status */}
      <div className="flex flex-1 flex-col min-w-0">
        <p className="text-xs font-semibold text-white drop-shadow-lg truncate">{name}</p>
        <div className="flex items-center gap-1 text-xs text-white/70">
          {muted ? (
            <span className="rounded-full bg-black/60 px-1.5 py-0.5 text-xs uppercase tracking-wide">Muted</span>
          ) : (
            <span className="rounded-full bg-emerald-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">
              {isSpeaking ? "Speaking" : "Live"}
            </span>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/20" aria-hidden />
    </div>
  );
}
