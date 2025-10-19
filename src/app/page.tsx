"use client";

import { useCallback, useMemo, useState } from "react";
import {
  LayoutGrid,
  MessageSquare,
  Mic,
  MonitorSmartphone,
  MoreHorizontal,
  PhoneOff,
  Settings,
  ShieldCheck,
  Signal,
  Users,
  Video,
  Wifi,
} from "lucide-react";

import { ParticipantCard } from "@/components/call/participant-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const participants = [
  {
    name: "Alex Johnson",
    status: "Product Design • San Francisco",
    isSpeaking: true,
    background: "from-sky-500/80 via-indigo-500/70 to-indigo-900/70",
  },
  {
    name: "Priya Patel",
    status: "Research • Remote",
    muted: true,
    background: "from-purple-500/70 via-violet-500/60 to-fuchsia-800/70",
  },
  {
    name: "Diego Ramirez",
    status: "Engineering • Bogotá",
    background: "from-emerald-500/70 via-teal-500/60 to-cyan-800/70",
  },
  {
    name: "Mina Okafor",
    status: "Marketing • Lagos",
    muted: true,
    background: "from-amber-500/80 via-orange-500/70 to-rose-800/70",
  },
];

type TransmitState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [transmitState, setTransmitState] = useState<TransmitState>("idle");
  const [lastPayload, setLastPayload] = useState<{
    seq_no: number;
    tokens: string[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const callStartTime = useMemo(() => {
    const date = new Date();
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  const createPayload = useCallback(() => {
    const seq_no = Math.floor(100000 + Math.random() * 900000);
    const tokenCount = Math.floor(Math.random() * 5) + 4;
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const tokens = Array.from({ length: tokenCount }, () =>
      Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)])
        .join("")
    );

    return { seq_no, tokens };
  }, []);

  const handleTransmit = useCallback(async () => {
    const payload = createPayload();
    setLastPayload(payload);
    setTransmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setTransmitState("success");
    } catch (error) {
      setTransmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setTimeout(() => setTransmitState("idle"), 3000);
    }
  }, [createPayload]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Product Sync</p>
            <h1 className="text-2xl font-semibold text-white">Aurora design review</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
              <span>Recording</span>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:flex">
              <Signal className="h-4 w-4" />
              <span>Live • {callStartTime}</span>
            </div>
            <Button variant="secondary" size="sm" className="hidden md:inline-flex">
              <Users className="mr-2 h-4 w-4" /> 18
            </Button>
            <Button variant="outline" size="sm" className="text-white">
              <ShieldCheck className="mr-2 h-4 w-4" /> Security
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
        <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 p-6 shadow-2xl">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <ParticipantCard {...participants[0]} />
                </div>
                {participants.slice(1).map((participant) => (
                  <ParticipantCard key={participant.name} {...participant} />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Wifi className="h-5 w-5 text-emerald-400" />
                <span>Connection is excellent</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="ghost" size="icon" className="bg-white/5 text-white hover:bg-white/10">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/5 text-white hover:bg-white/10">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex bg-white/5 text-white hover:bg-white/10">
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex bg-white/5 text-white hover:bg-white/10">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex bg-white/5 text-white hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full text-white">
                  <PhoneOff className="h-5 w-5" />
                </Button>
                <Button variant="secondary" className="gap-2">
                  <MonitorSmartphone className="h-4 w-4" /> Present
                </Button>
                <Button
                  onClick={handleTransmit}
                  disabled={transmitState === "loading"}
                  className={cn(
                    "gap-2 bg-emerald-500 text-emerald-950 hover:bg-emerald-400",
                    transmitState === "success" && "bg-emerald-400 hover:bg-emerald-400",
                    transmitState === "error" && "bg-rose-500 hover:bg-rose-500"
                  )}
                >
                  {transmitState === "loading" ? "Transmitting..." : "Transmit"}
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex bg-white/5 text-white hover:bg-white/10">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {lastPayload ? (
              <div className="flex flex-col gap-2 rounded-3xl border border-white/5 bg-black/40 p-6 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Last transmit payload</span>
                  <span
                    className={cn("text-xs uppercase tracking-wider", {
                      "text-emerald-400": transmitState === "success",
                      "text-rose-400": transmitState === "error",
                      "text-white/60": transmitState === "idle" || transmitState === "loading",
                    })}
                  >
                    {transmitState === "success"
                      ? "Delivered"
                      : transmitState === "error"
                        ? "Failed"
                        : transmitState === "loading"
                          ? "Sending"
                          : "Idle"}
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-2xl bg-black/60 p-4 text-xs text-emerald-200">
{JSON.stringify(lastPayload, null, 2)}
                </pre>
                {transmitState === "error" && errorMessage ? (
                  <p className="text-xs text-rose-300">{errorMessage}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-xl">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-slate-900/60 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Agenda</p>
              <h2 className="mt-3 text-2xl font-semibold">Quarterly rollout planning</h2>
              <ul className="mt-6 space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  Align feature launch milestones
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                  Review usability study insights
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                  Confirm beta participant list
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white/80">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Live Notes</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="font-medium text-white">Alex Johnson</p>
                  <p className="text-white/70">Presenting new journey map for onboarding.</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="font-medium text-white">Diego Ramirez</p>
                  <p className="text-white/70">Infra team ready for gradual rollout starting July.</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="font-medium text-white">Priya Patel</p>
                  <p className="text-white/70">Usability report indicates 15% faster task completion.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-900/60 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Next session</p>
              <div className="mt-3 text-white">
                <p className="text-lg font-semibold">Stakeholder preview</p>
                <p className="text-sm text-white/70">Friday, 1:00 PM PST</p>
              </div>
              <Button variant="secondary" className="mt-6 w-full justify-center">
                <Users className="mr-2 h-4 w-4" /> RSVP to calendar
              </Button>
            </div>
          </aside>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-4 text-center text-xs text-white/40">
        Secure by default • End-to-end encrypted
      </footer>
    </div>
  );
}
