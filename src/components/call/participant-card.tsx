import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ParticipantCardProps {
  name: string;
  isSpeaking?: boolean;
  muted?: boolean;
  background?: string;
  showVideo?: boolean;
  size?: "compact" | "large";
  filter?: 'none' | 'robot' | 'cat' | 'rainbow' | 'neon' | 'space';
}

const fallbackGradient = "from-slate-700 via-slate-800 to-slate-900";

export function ParticipantCard({
  name,
  isSpeaking,
  muted,
  background,
  showVideo = false,
  size = "compact",
  filter = 'none',
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
      console.error('Camera access error:', error);
      setCameraError('Camera not available');
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

  // Apply filter animations based on speaking state
  const getVideoFilters = () => {
    if (!isVideoActive) return '';
    
    const baseFilters = 'brightness(1.1) contrast(1.1) saturate(1.2)';
    const speakingFilters = isSpeaking 
      ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)) hue-rotate(10deg)' 
      : '';
    
    return `${baseFilters} ${speakingFilters}`;
  };

  // Get animated filter overlay styles
  const getFilterOverlay = () => {
    if (filter === 'none' || !isVideoActive) return null;

    const baseStyles = "absolute inset-0 pointer-events-none z-10";
    
    switch (filter) {
      case 'robot':
        return (
          <div className={`${baseStyles} bg-gradient-to-br from-cyan-400/20 via-blue-500/30 to-purple-600/20 animate-pulse`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.3)_0%,transparent_50%)] animate-spin" style={{animationDuration: '8s'}} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3)_0%,transparent_50%)] animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}} />
            <div className="absolute top-4 left-4 w-8 h-8 bg-cyan-400/40 rounded-full animate-bounce" />
            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-cyan-400/60 to-blue-500/60 rounded-full animate-pulse" />
          </div>
        );
      
      case 'cat':
        return (
          <div className={`${baseStyles} bg-gradient-to-br from-pink-400/20 via-orange-500/30 to-yellow-600/20`}>
            <div className="absolute top-2 left-2 w-4 h-4 bg-pink-500/60 rounded-full animate-pulse" />
            <div className="absolute top-2 right-2 w-4 h-4 bg-pink-500/60 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-pink-400/60 to-orange-500/60 rounded-full animate-bounce" />
            <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-orange-500/60 rounded-full animate-ping" />
            <div className="absolute bottom-4 right-1/4 w-3 h-3 bg-orange-500/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
          </div>
        );
      
      case 'rainbow':
        return (
          <div className={`${baseStyles} bg-gradient-to-r from-red-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 via-indigo-400/20 to-purple-400/20 animate-pulse`}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 via-green-500/30 via-blue-500/30 via-indigo-500/30 to-purple-500/30 animate-spin" style={{animationDuration: '4s'}} />
            <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
            <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}} />
            <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" style={{animationDelay: '0.9s'}} />
          </div>
        );
      
      case 'neon':
        return (
          <div className={`${baseStyles} bg-gradient-to-br from-green-400/20 via-cyan-400/30 to-blue-500/20`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.4)_0%,transparent_70%)] animate-pulse" />
            <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-green-400/60 via-cyan-400/60 to-blue-400/60 rounded-full animate-pulse" />
          </div>
        );
      
      case 'space':
        return (
          <div className={`${baseStyles} bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-indigo-900/30`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.4)_0%,transparent_50%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.4)_0%,transparent_50%)] animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-3 left-3 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-6 right-4 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-6 right-6 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '10s'}} />
          </div>
        );
      
      default:
        return null;
    }
  };

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
            style={{ filter: getVideoFilters() }}
          />
        ) : null}

        {/* Animated Filter Overlay */}
        {getFilterOverlay()}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-black/20" aria-hidden />

        {/* Footer info */}
        <div className="relative z-10 flex w-full items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm overflow-hidden">
              {showVideo && isVideoActive ? null : (
                <span className="text-xs font-semibold text-white drop-shadow-lg">{initials}</span>
              )}
              {isSpeaking && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-1 ring-black/40 animate-pulse" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold drop-shadow-lg truncate">{name}</p>
              <div className="flex items-center gap-2 text-xs text-white/80">
                {muted ? (
                  <span className="rounded-full bg-black/60 px-2 py-0.5 uppercase tracking-wide">Muted</span>
                ) : (
                  <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 uppercase tracking-wide">{isSpeaking ? "Speaking" : "Live"}</span>
                )}
                {showVideo && isVideoActive && (
                  <span className="rounded-full bg-blue-500/80 px-2 py-0.5 uppercase tracking-wide">Video</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              filter: getVideoFilters(),
              transform: isSpeaking ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <span className="text-sm font-semibold text-white drop-shadow-lg">{initials}</span>
        )}
        
        {/* Animated Filter Overlay for compact */}
        {showVideo && isVideoActive && (
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            {getFilterOverlay()}
          </div>
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
          {muted ? (
            <span className="rounded-full bg-black/60 px-1.5 py-0.5 text-xs uppercase tracking-wide">Muted</span>
          ) : (
            <span className="rounded-full bg-emerald-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">
              {isSpeaking ? "Speaking" : "Live"}
            </span>
          )}
          {showVideo && isVideoActive && (
            <span className="rounded-full bg-blue-500/80 px-1.5 py-0.5 text-xs uppercase tracking-wide">Video</span>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/20" aria-hidden />
    </div>
  );
}
