"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/services";
import { Loader2 } from "lucide-react";

export default function BracketsPage() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [bracketData, setBracketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categories?.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategoryId) {
      setIsLoading(true);
      fetch(`/api/tournament/brackets?categoryId=${selectedCategoryId}`)
        .then(res => res.json())
        .then(data => {
          setBracketData(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedCategoryId]);

  const renderMatchNode = (match: any, label?: string) => {
    if (!match) return null;
    return (
      <div className="relative">
        {label && (
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{label}</span>
          </div>
        )}
        <div className={`w-64 glass p-4 space-y-2 ${label ? 'border-2 border-accent shadow-2xl shadow-accent/10 scale-110 overflow-hidden' : 'border-l-4 border-l-primary'}`}>
          {label && match.status === "LIVE" && (
            <div className="absolute top-0 right-0 p-1 bg-accent text-white text-[8px] font-black uppercase tracking-tighter">Live</div>
          )}
          <div className={`flex justify-between items-center p-2 rounded ${match.winnerTeamId === match.teamAId && match.winnerTeamId ? 'bg-primary/20' : 'bg-white/40'}`}>
            <span className="text-xs font-bold truncate pr-4">{match.team1}</span>
            <span className="font-black text-primary">{match.score1}</span>
          </div>
          {label && (
            <div className="flex justify-center py-1">
              <div className="w-8 h-px bg-foreground/10"></div>
            </div>
          )}
          <div className={`flex justify-between items-center p-2 rounded ${match.winnerTeamId === match.teamBId && match.winnerTeamId ? 'bg-primary/20' : 'bg-white/40'}`}>
            <span className="text-xs font-bold truncate pr-4">{match.team2}</span>
            <span className="font-black text-primary">{match.score2}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground mb-4">Vòng Loại Trực Tiếp</h1>
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.3em]">Knockout Tree - Bán kết & Chung kết</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategoryId === cat.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/50 border border-foreground/5 text-foreground/40 hover:bg-white hover:text-foreground'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Bracket Tree Visualization */}
      <div className="relative overflow-x-auto pb-12">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : bracketData ? (
          <div className="min-w-[800px] flex justify-center items-center py-20 gap-20">

            {/* Semi-Finals */}
            <div className="flex flex-col gap-32 relative">
              <div className="relative">
                {renderMatchNode(bracketData.semi1)}
                {/* Connector Line */}
                <div className="absolute -right-20 top-1/2 w-20 h-[2px] bg-foreground/10 after:absolute after:bottom-0 after:right-0 after:w-[2px] after:h-16 after:bg-foreground/10"></div>
              </div>
              <div className="relative">
                {renderMatchNode(bracketData.semi2)}
                {/* Connector Line */}
                <div className="absolute -right-20 top-1/2 w-20 h-[2px] bg-foreground/10 before:absolute before:top-0 before:right-0 before:w-[2px] before:h-16 before:bg-foreground/10"></div>
              </div>
            </div>

            {/* Finals */}
            <div className="relative">
              {renderMatchNode(bracketData.final, "Grand Final")}
            </div>

            {/* Winner Section */}
            {bracketData.final?.status === "FINISHED" && (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/30">The Champions</p>
                <p className="font-bold text-primary">{bracketData.final.winnerTeamId === bracketData.final.teamAId ? bracketData.final.team1 : bracketData.final.team2}</p>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 font-bold">Chưa có dữ liệu lịch thi đấu cho nội dung này.</div>
        )}
      </div>
    </div>
  );
}
