"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Signal,
  Users,
  Wifi,
  Clock,
  Volume2,
  Video,
  VideoOff,
  Sparkles,
} from "lucide-react";

import { ParticipantCard } from "@/components/call/participant-card";
import { Button } from "@/components/ui/button";

const participants = [
  {
    name: "Interviewer",
    isSpeaking: true,
    background: "from-sky-500/80 via-indigo-500/70 to-indigo-900/70",
  },
  {
    name: "Candidate",
    isSpeaking: false,
    background: "from-purple-500/70 via-violet-500/60 to-fuchsia-800/70",
  },
];

type FilterType = 'none' | 'robot' | 'cat' | 'rainbow' | 'neon' | 'space';

const filters = [
  { id: 'none', name: 'None', icon: '👤' },
  { id: 'robot', name: 'Robot', icon: '🤖' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
  { id: 'neon', name: 'Neon', icon: '⚡' },
  { id: 'space', name: 'Space', icon: '🚀' },
];

export default function Home() {
  const [interviewStartTime] = useState(() => Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [showVideo, setShowVideo] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const callStartTime = useMemo(() => {
    const date = new Date();
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate elapsed time
  const elapsedTime = useMemo(() => {
    const elapsed = Math.floor((currentTime - interviewStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [currentTime, interviewStartTime]);

  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    setShowVideo(prev => !prev);
  }, []);

  // Cycle through filters
  const cycleFilter = useCallback(() => {
    setCurrentFilter(prev => {
      const currentIndex = filters.findIndex(f => f.id === prev);
      const nextIndex = (currentIndex + 1) % filters.length;
      return filters[nextIndex].id as FilterType;
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">System Design Interview</h1>
            <p className="text-sm text-white/70">Design a scalable chat application</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-emerald-400">{elapsedTime}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Signal className="h-4 w-4" />
              <span>Live • {callStartTime}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Users className="h-4 w-4" />
              <span>2 participants</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-6 py-6">
        <section className="grid flex-1 gap-4 lg:grid-cols-[240px_1fr]">
          {/* Participants Section - Compact */}
          <div className="flex flex-col gap-3">
            {/* Large Candidate Preview when video is enabled */}
            {showVideo ? (
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 shadow-lg">
                <ParticipantCard 
                  name="Candidate" 
                  isSpeaking={false}
                  background="from-purple-500/70 via-violet-500/60 to-fuchsia-800/70"
                  showVideo={true}
                  size="large"
                  filter={currentFilter}
                />
              </div>
            ) : null}

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 shadow-lg">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <ParticipantCard 
                    key={participant.name} 
                    {...participant} 
                    showVideo={showVideo && participant.name === "Candidate"} 
                    size="compact"
                  />
                ))}
              </div>
            </div>

            {/* Minimal Controls */}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Wifi className="h-3 w-3 text-emerald-400" />
                <span className="text-xs">Good</span>
                {currentFilter !== 'none' && showVideo && (
                  <span className="text-xs text-purple-400">
                    {filters.find(f => f.id === currentFilter)?.icon} {filters.find(f => f.id === currentFilter)?.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleListening}
                  className={`h-6 w-6 ${isListening ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleVideo}
                  className={`h-6 w-6 ${showVideo ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {showVideo ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={cycleFilter}
                  className={`h-6 w-6 ${currentFilter !== 'none' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
                  disabled={!showVideo}
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
                <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full text-white">
                  <PhoneOff className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Excalidraw Section - Maximized */}
          <div className="flex flex-col">
            <div className="flex h-full flex-col rounded-xl border border-white/10 bg-black/30 p-4 shadow-xl">
              <h3 className="text-base font-semibold text-white mb-3">Design & Notes</h3>
              <div className="flex-1 w-full rounded-lg border border-white/10 bg-white overflow-hidden">
                <iframe
                  src="https://excalidraw.com/"
                  className="h-full w-full"
                  title="Excalidraw Drawing Board"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Live Transcript */}
      {(transcript || interimTranscript || isListening) && (
        <div className="mx-auto w-full max-w-7xl px-6 pb-4">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Live Transcript</h3>
              {isListening && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Listening...</span>
                </div>
              )}
            </div>
            <div className="text-sm text-white/90 leading-relaxed">
              {transcript && (
                <div className="mb-2">
                  <span className="text-white">{transcript}</span>
                </div>
              )}
              {interimTranscript && (
                <div className="text-white/60 italic">
                  {interimTranscript}
                </div>
              )}
              {!transcript && !interimTranscript && isListening && (
                <div className="text-white/60 italic">
                  Start speaking to see live transcript...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 bg-black/40 py-2 text-center text-xs text-white/40">
        System Design Interview Session
      </footer>
    </div>
  );
}
