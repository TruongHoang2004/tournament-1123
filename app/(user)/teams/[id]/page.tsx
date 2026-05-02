"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Team, Match, TournamentState } from "@/lib/types";
import { initialData } from "@/lib/data";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = Number(params.id);
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
  }, []);

  const team = data.teams.find(t => t.id === teamId);
  const teamMatches = data.matches.filter(m => m.team1Id === teamId || m.team2Id === teamId);

  if (!team) return <div className="p-20 text-center">Team not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full space-y-12">
      <div className="glass p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5">
        <span className={`inline-block text-[10px] font-black uppercase px-4 py-1.5 rounded-full mb-6 ${team.group === 'A' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
          Group {team.group}
        </span>
        <h1 className="text-6xl font-black uppercase italic tracking-tighter text-foreground mb-4">{team.name}</h1>
        <div className="flex justify-center items-center gap-8 mt-8">
           <div className="text-center">
             <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">Rank Points</p>
             <p className="text-4xl font-black text-primary">{team.points}</p>
           </div>
           <div className="w-[1px] h-12 bg-foreground/10"></div>
           <div className="text-center">
             <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">Total Matches</p>
             <p className="text-4xl font-black text-foreground">{teamMatches.length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8">
           <h2 className="text-xl font-black uppercase italic mb-6">Team Roster</h2>
           <div className="grid grid-cols-1 gap-3">
             {team.members.map((member, i) => (
               <div key={i} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl border border-foreground/5 shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                   {i + 1}
                 </div>
                 <span className="font-bold text-foreground/80">{member}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="glass p-8">
           <h2 className="text-xl font-black uppercase italic mb-6">Recent Form</h2>
           <div className="space-y-4">
             {teamMatches.length === 0 ? (
               <p className="text-xs text-foreground/30 italic">No matches played yet.</p>
             ) : (
               teamMatches.map(match => {
                 const isTeam1 = match.team1Id === teamId;
                 const opponentId = isTeam1 ? match.team2Id : match.team1Id;
                 const opponent = data.teams.find(t => t.id === opponentId);
                 const teamScore = isTeam1 ? match.score1 : match.score2;
                 const opponentScore = isTeam1 ? match.score2 : match.score1;
                 const isWinner = teamScore > opponentScore && match.status === 'FINISHED';

                 return (
                   <div key={match.id} className="p-4 bg-white/50 rounded-xl border border-foreground/5 flex justify-between items-center">
                     <div>
                       <p className="text-[8px] font-black uppercase text-accent mb-1">{match.category}</p>
                       <p className="text-sm font-bold text-foreground/80">vs {opponent?.name}</p>
                     </div>
                     <div className="text-right">
                       <p className={`text-xl font-black ${isWinner ? 'text-primary' : 'text-foreground'}`}>
                         {teamScore} - {opponentScore}
                       </p>
                       <span className="text-[8px] font-black uppercase opacity-40">{match.status}</span>
                     </div>
                   </div>
                 );
               })
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
