"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TournamentState, Category } from "@/lib/types";
import { initialData } from "@/lib/data";

export default function Home() {
  const [data, setData] = useState<TournamentState>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tournament');
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const { teams, matches } = data;

  const getTeamName = (id: number) => teams.find(t => t.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/badminton_hero_bg_1777450769012.png"
            alt="Badminton Tournament"
            fill
            className="object-cover brightness-[0.2] scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">Live Tournament Tracker</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase">
            <span className="gradient-text">1123</span> Badminton
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-[0.3em] uppercase">
            Internal Championship 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20 space-y-12">
        
        {/* Top Stats: Total Team Points */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {teams.sort((a,b) => b.points - a.points).map((team, idx) => (
             <div key={team.id} className="glass p-4 text-center group hover:border-primary/30 transition-all">
                <p className="text-[8px] font-black uppercase text-zinc-600 mb-1">Rank {idx + 1}</p>
                <h3 className="text-sm font-bold truncate mb-2">{team.name}</h3>
                <p className="text-3xl font-black text-primary">{team.points}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase mt-1">Total Points</p>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Group Standings */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Group A */}
              <div className="glass p-8">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary">Group A</h2>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Standings</span>
                </div>
                <div className="space-y-4">
                  {teams.filter(t => t.group === "A").sort((a, b) => b.points - a.points).map((team, idx) => (
                    <div key={team.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/[0.08] transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-zinc-600">{idx + 1}</span>
                        <span className="font-bold">{team.name}</span>
                      </div>
                      <span className="text-xl font-black">{team.points} <span className="text-[8px] text-zinc-500">PTS</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group B */}
              <div className="glass p-8">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-secondary">Group B</h2>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Standings</span>
                </div>
                <div className="space-y-4">
                  {teams.filter(t => t.group === "B").sort((a, b) => b.points - a.points).map((team, idx) => (
                    <div key={team.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/[0.08] transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-zinc-600">{idx + 1}</span>
                        <span className="font-bold">{team.name}</span>
                      </div>
                      <span className="text-xl font-black">{team.points} <span className="text-[8px] text-zinc-500">PTS</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live/Recent Matches */}
            <div className="glass p-8">
               <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8">Category Timelines</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(match => (
                    <div key={match.id} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">{match.category}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${match.status === 'LIVE' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-bold truncate">{getTeamName(match.team1Id)}</p>
                          <p className="text-2xl font-black mt-1">{match.score1}</p>
                        </div>
                        <div className="px-4 text-[10px] font-black text-zinc-700">VS</div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-bold truncate">{getTeamName(match.team2Id)}</p>
                          <p className="text-2xl font-black mt-1">{match.score2}</p>
                        </div>
                      </div>
                      {match.status === "FINISHED" && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[8px] font-black uppercase text-zinc-500">
                          <span>Team 1: +{match.pointsEarned1} PTS</span>
                          <span>Team 2: +{match.pointsEarned2} PTS</span>
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Tournament Rules & Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-8 bg-primary/5 border-primary/20">
              <h2 className="text-lg font-black uppercase italic tracking-tighter mb-6">Tournament Rules</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-primary text-black flex items-center justify-center text-[10px] font-black">01</span>
                  <div>
                    <h4 className="text-xs font-black uppercase">Points Accumulation</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">A team's total score is the sum of points earned across all 6 match categories.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-primary text-black flex items-center justify-center text-[10px] font-black">02</span>
                  <div>
                    <h4 className="text-xs font-black uppercase">Scoring System</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      Group Stage: Win 2, Loss 0<br/>
                      Semi-finals: Win 3, Loss 1<br/>
                      Finals: Win 4, Loss 2
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded bg-primary text-black flex items-center justify-center text-[10px] font-black">03</span>
                  <div>
                    <h4 className="text-xs font-black uppercase">Match Structure</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Each category is independent. No single team-vs-team match exists.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 p-4 bg-black/40 rounded border border-white/5 text-center">
                 <p className="text-[10px] font-black uppercase text-zinc-500">Official Match Day</p>
                 <p className="text-lg font-black text-white mt-1 uppercase italic">May 17, 2026</p>
              </div>
            </div>

            <div className="glass p-8 border-white/5">
              <h2 className="text-lg font-black uppercase italic tracking-tighter mb-6">Match Categories</h2>
              <div className="space-y-2">
                {[
                  "Advanced Men's Doubles",
                  "Mixed-Level Men's Doubles",
                  "Intermediate Men's Doubles",
                  "Advanced Mixed Doubles",
                  "Intermediate Mixed Doubles",
                  "Women's Doubles"
                ].map((cat, i) => (
                  <div key={i} className="text-[9px] font-black uppercase text-zinc-500 border-l-2 border-primary pl-3 py-1 bg-white/[0.02]">
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-zinc-700 text-[10px] font-black tracking-[0.4em] uppercase">
          1123 Badminton &bull; Built for Champions
        </p>
      </footer>
    </div>
  );
}
