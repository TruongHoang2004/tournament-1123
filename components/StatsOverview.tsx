"use client";

import { Team } from "@/lib/types";

interface StatsOverviewProps {
  teams: Team[];
}

export default function StatsOverview({ teams }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {teams.sort((a, b) => b.points - a.points).map((team, idx) => (
        <div key={team.id} className="glass p-4 text-center group hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
          <p className="text-[8px] font-black uppercase text-foreground/40 mb-1">Rank {idx + 1}</p>
          <h3 className="text-sm font-bold truncate mb-2 text-foreground/80">{team.name}</h3>
          <p className="text-3xl font-black text-primary">{team.points}</p>
          <p className="text-[8px] font-bold text-foreground/40 uppercase mt-1">Total Points</p>
        </div>
      ))}
    </div>
  );
}
