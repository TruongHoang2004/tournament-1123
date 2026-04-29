"use client";

import { useState, useEffect } from "react";
import { Team, TournamentState } from "@/lib/types";
import { initialData } from "@/lib/data";
import Link from "next/link";

export default function TeamsPage() {
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground mb-4">Tournament Teams</h1>
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Participants & Groups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.teams.map((team) => (
          <Link 
            key={team.id} 
            href={`/teams/${team.id}`}
            className="glass p-8 group hover:border-primary/50 transition-all hover:-translate-y-2"
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${team.group === 'A' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                Group {team.group}
              </span>
              <span className="text-3xl font-black text-primary">{team.points}</span>
            </div>
            
            <h2 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">{team.name}</h2>
            
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase text-foreground/30 mb-2">Members</p>
               <div className="flex flex-wrap gap-2">
                 {team.members.map((member, i) => (
                   <span key={i} className="text-[10px] font-bold bg-foreground/5 px-2 py-1 rounded text-foreground/60">
                     {member}
                   </span>
                 ))}
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-foreground/5 flex justify-end">
               <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all">
                 View Details →
               </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
