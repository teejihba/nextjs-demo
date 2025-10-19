import Image from "next/image";
import { cn } from "@/lib/utils";

interface ParticipantCardProps {
  name: string;
  isSpeaking?: boolean;
  status?: string;
  muted?: boolean;
  background?: string;
}

const fallbackGradient = "from-slate-700 via-slate-800 to-slate-900";

export function ParticipantCard({
  name,
  isSpeaking,
  status,
  muted,
  background,
}: ParticipantCardProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-end justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6 shadow-xl",
        background ? `bg-gradient-to-br ${background}` : `bg-gradient-to-br ${fallbackGradient}`,
        isSpeaking ? "ring-4 ring-primary ring-offset-4 ring-offset-black/40" : ""
      )}
    >
      <div className="relative z-10">
        <p className="text-lg font-semibold drop-shadow-lg">{name}</p>
        {status ? (
          <p className="text-sm text-white/70 drop-shadow-lg">{status}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 text-sm text-white/70">
        {muted ? (
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide">Muted</span>
        ) : null}
        <span className="rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide">
          {isSpeaking ? "Speaking" : "Live"}
        </span>
      </div>
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/call-texture.svg"
          alt="Texture"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
