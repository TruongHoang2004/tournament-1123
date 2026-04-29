"use client";

import { Team } from "@/lib/types";

interface StandingsProps {
  teams: Team[];
}

export default function Standings({ teams }: StandingsProps) {
  const groupA = teams.filter(t => t.group === "A").sort((a, b) => b.points - a.points);
  const groupB = teams.filter(t => t.group === "B").sort((a, b) => b.points - a.points);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Group A */}
      <div className="glass p-8 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-accent">Group A</h2>
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Standings</span>
        </div>
        <div className="space-y-4">
          {groupA.map((team, idx) => (
            <div key={team.id} className="flex flex-col items-center p-4 bg-accent/5 rounded-lg border border-accent/10 group hover:bg-accent/10 transition-all text-center">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black ${idx === 0 ? 'text-primary' : 'text-foreground/30'}`}>{idx + 1}</span>
                <span className="font-bold text-foreground/80">{team.name}</span>
              </div>
              <span className="text-2xl font-black text-primary">{team.points} <span className="text-[8px] text-foreground/40">PTS</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Group B */}
      <div className="glass p-8 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-secondary">Group B</h2>
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Standings</span>
        </div>
        <div className="space-y-4">
          {groupB.map((team, idx) => (
            <div key={team.id} className="flex flex-col items-center p-4 bg-secondary/5 rounded-lg border border-secondary/10 group hover:bg-secondary/10 transition-all text-center">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black ${idx === 0 ? 'text-primary' : 'text-foreground/30'}`}>{idx + 1}</span>
                <span className="font-bold text-foreground/80">{team.name}</span>
              </div>
              <span className="text-2xl font-black text-primary">{team.points} <span className="text-[8px] text-foreground/40">PTS</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
