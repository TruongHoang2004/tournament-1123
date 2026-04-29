"use client";

import { Match, Team } from "@/lib/types";

interface MatchTimelineProps {
  matches: Match[];
  teams: Team[];
}

export default function MatchTimeline({ matches, teams }: MatchTimelineProps) {
  const getTeamName = (id: number) => teams.find(t => t.id === id)?.name || "Unknown";

  return (
    <div className="glass p-8">
      <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-foreground text-center">Category Timelines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <div key={match.id} className="p-6 rounded-xl bg-white/50 border border-accent/10 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all relative overflow-hidden group">
            <div className="flex flex-col items-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{match.category}</span>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${match.status === 'LIVE' ? 'bg-primary/15 text-primary animate-pulse' : 'bg-foreground/5 text-foreground/40'}`}>
                {match.status}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-center">
                <p className="text-sm font-bold truncate text-foreground/70">{getTeamName(match.team1Id)}</p>
                <p className="text-3xl font-black mt-1 text-foreground">{match.score1}</p>
              </div>
              <div className="text-[10px] font-black text-foreground/20 uppercase tracking-widest py-1">vs</div>
              <div className="text-center">
                <p className="text-sm font-bold truncate text-foreground/70">{getTeamName(match.team2Id)}</p>
                <p className="text-3xl font-black mt-1 text-foreground">{match.score2}</p>
              </div>
            </div>
            {match.status === "FINISHED" && (
              <div className="mt-6 pt-4 border-t border-accent/10 flex flex-col items-center gap-1 text-[8px] font-black uppercase text-foreground/40">
                <p>Team 1: <span className="text-primary">+{match.pointsEarned1}</span> PTS</p>
                <p>Team 2: <span className="text-primary">+{match.pointsEarned2}</span> PTS</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
