"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Mic,
  PhoneOff,
  Signal,
  Users,
  Wifi,
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

export default function Home() {
  const callStartTime = useMemo(() => {
    const date = new Date();
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-white">System Design Interview</h1>
            <p className="text-sm text-white/70">Design a scalable chat application</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
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

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8">
        <section className="grid flex-1 gap-6 lg:grid-cols-[400px_1fr]">
          {/* Participants Section */}
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 p-6 shadow-2xl">
              <div className="grid gap-4">
                {participants.map((participant) => (
                  <ParticipantCard key={participant.name} {...participant} />
                ))}
              </div>
            </div>

            {/* Simple Controls */}
            <div className="flex items-center justify-center gap-4 rounded-3xl border border-white/10 bg-black/40 px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Wifi className="h-5 w-5 text-emerald-400" />
                <span>Connection is excellent</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="bg-white/5 text-white hover:bg-white/10">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full text-white">
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Excalidraw Section */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Design & Notes</h3>
              <div className="h-[600px] w-full rounded-2xl border border-white/10 bg-white">
                <iframe
                  src="https://excalidraw.com/"
                  className="h-full w-full rounded-2xl"
                  title="Excalidraw Drawing Board"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-4 text-center text-xs text-white/40">
        System Design Interview Session
      </footer>
    </div>
  );
}
