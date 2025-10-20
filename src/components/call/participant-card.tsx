import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ParticipantCardProps {
  name: string;
  isSpeaking?: boolean;
  muted?: boolean;
  background?: string;
  showVideo?: boolean;
  size?: "compact" | "large";
}

const fallbackGradient = "from-slate-700 via-slate-800 to-slate-900";

export function ParticipantCard({
  name,
  isSpeaking,
  muted,
  background,
  showVideo = false,
  size = "compact",
}: ParticipantCardProps) {
  // Generate initials from name
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isVideoActive, setIsVideoActive] = useState(false);

  // Initialize camera when showVideo is true
  useEffect(() => {
    if (showVideo && !videoStream) {
      initializeCamera();
    } else if (!showVideo && videoStream) {
      stopCamera();
    }
  }, [showVideo]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user'
        },
        audio: false
      });
      
      setVideoStream(stream);
      setIsVideoActive(true);
      setCameraError("");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Camera access denied");
      setIsVideoActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setIsVideoActive(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (size === "large") {
    return (
      <div
        className={cn(
          "relative flex aspect-video w-full items-end overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r p-3 shadow-lg transition-all duration-300",
          background ? `bg-gradient-to-r ${background}` : `bg-gradient-to-r ${fallbackGradient}`,
          isSpeaking ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-black/40" : ""
        )}
      >
        {/* Large Video */}
        {showVideo && isVideoActive ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : null}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-black/20" aria-hidden />

        {/* Footer info */}
        <div className="relative z-10 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white">{name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <span className="rounded-full bg-emerald-500/80 px-2 py-1 text-xs uppercase tracking-wide text-white">
                Speaking
              </span>
            )}
            {showVideo && isVideoActive && (
              <span className="rounded-full bg-blue-500/80 px-2 py-1 text-xs uppercase tracking-wide text-white">
                Video
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact layout
  return (
    <div
      className={cn(
        "relative flex h-14 w-full items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-r p-3 shadow-md transition-all duration-300",
        background ? `bg-gradient-to-r ${background}` : `bg-gradient-to-r ${fallbackGradient}`,
        isSpeaking ? "ring-1 ring-emerald-400 ring-offset-1 ring-offset-black/40" : ""
      )}
    >
      {/* Video or Avatar */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm overflow-hidden">
        {showVideo && isVideoActive ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover rounded-full transition-all duration-300"
            style={{
              transform: isSpeaking ? 'scaleX(-1) scale(1.05)' : 'scaleX(-1) scale(1)',
            }}
          />
        ) : (
          <span className="text-sm font-semibold text-white drop-shadow-lg">{initials}</span>
        )}
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-1 ring-black/40 animate-pulse" />
        )}
        
        {/* Camera error indicator */}
        {showVideo && cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-full">
            <span className="text-xs text-red-400">📷</span>
          </div>
        )}
      </div>
      
      {/* Name and Status */}
      <div className="flex flex-1 flex-col min-w-0">
        <p className="text-xs font-semibold text-white drop-shadow-lg truncate">{name}</p>
        <div className="flex items-center gap-1 text-xs text-white/70">
          {isSpeaking ? (
            <span className="rounded-full bg-emerald-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">
              Speaking
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">
              Live
            </span>
          )}
          {showVideo && isVideoActive && (
            <span className="rounded-full bg-blue-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">
              Video
            </span>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/20" aria-hidden />
    </div>
  );
}