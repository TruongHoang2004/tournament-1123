"use client";

import { useState, useEffect } from "react";
import { TournamentState, Category } from "@/lib/types";
import { initialData } from "@/lib/data";

export default function BracketsPage() {
  const [data, setData] = useState<TournamentState>(initialData);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Advanced Men's Doubles");

  const categories: Category[] = [
    "Advanced Men's Doubles",
    "Mixed-Level Men's Doubles",
    "Intermediate Men's Doubles",
    "Advanced Mixed Doubles",
    "Intermediate Mixed Doubles",
    "Women's Doubles"
  ];

  const getTeamName = (id: number) => data.teams.find(t => t.id === id)?.name || "TBD";

  // Mock bracket data for visualization
  const bracketData = {
    semi1: { team1: 2, team2: 4, score1: 21, score2: 18, status: "FINISHED" },
    semi2: { team1: 1, team2: 5, score1: 15, score2: 21, status: "FINISHED" },
    final: { team1: 2, team2: 5, score1: 0, score2: 0, status: "UPCOMING" }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground mb-4">Match Brackets</h1>
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Tournament Progression Tree</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === cat 
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
              : 'bg-white/50 border border-foreground/5 text-foreground/40 hover:bg-white hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bracket Tree Visualization */}
      <div className="relative overflow-x-auto pb-12">
        <div className="min-w-[800px] flex justify-center items-center py-20 gap-20">
          
          {/* Semi-Finals */}
          <div className="flex flex-col gap-32">
            {[bracketData.semi1, bracketData.semi2].map((match, i) => (
              <div key={i} className="relative">
                <div className="w-64 glass p-4 space-y-2 border-l-4 border-l-primary">
                  <div className="flex justify-between items-center bg-white/40 p-2 rounded">
                    <span className="text-xs font-bold truncate pr-4">{getTeamName(match.team1)}</span>
                    <span className="font-black text-primary">{match.score1}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/40 p-2 rounded">
                    <span className="text-xs font-bold truncate pr-4">{getTeamName(match.team2)}</span>
                    <span className="font-black text-primary">{match.score2}</span>
                  </div>
                </div>
                {/* Connector Line */}
                <div className={`absolute -right-20 top-1/2 w-20 h-[2px] bg-foreground/10 ${i === 0 ? 'after:absolute after:bottom-0 after:right-0 after:w-[2px] after:h-16 after:bg-foreground/10' : 'before:absolute before:top-0 before:right-0 before:w-[2px] before:h-16 before:bg-foreground/10'}`}></div>
              </div>
            ))}
          </div>

          {/* Finals */}
          <div className="relative">
            <div className="text-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Grand Final</span>
            </div>
            <div className="w-80 glass p-6 border-2 border-accent shadow-2xl shadow-accent/10 scale-110 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-1 bg-accent text-white text-[8px] font-black uppercase tracking-tighter">Live</div>
               <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase italic tracking-tighter">{getTeamName(bracketData.final.team1)}</span>
                    <span className="text-3xl font-black text-accent">{bracketData.final.score1}</span>
                  </div>
                  <div className="flex justify-center py-2">
                    <div className="w-8 h-[1px] bg-foreground/10"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase italic tracking-tighter">{getTeamName(bracketData.final.team2)}</span>
                    <span className="text-3xl font-black text-accent">{bracketData.final.score2}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Winner Section */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
               </svg>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/30">The Champions</p>
          </div>

        </div>
      </div>
    </div>
  );
}
