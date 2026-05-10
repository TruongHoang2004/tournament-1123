"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/services";
import { Loader2 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import UserMatchCard from "@/components/tournament/UserMatchCard";

interface Match {
  id: string;
  doubleA: any;
  doubleB: any;
  winnerTeamId: string | null;
  setScores: any[];
  playedAt: string | null;
}

interface TimelineMatch {
  id: string;
  order: number;
  round: { name: string };
  category: { name: string };
  matches: Match[];
}

export default function MatchesPage() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [matches, setMatches] = useState<TimelineMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [selectedCategoryId, categories]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const url = selectedCategoryId === "all" ? "/api/timeline" : `/api/timeline?category=${categories?.find((c: any) => c.id === selectedCategoryId)?.code}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
      <SectionHeader 
        title="Lịch Thi Đấu & Kết Quả"
        subtitle="Theo dõi tất cả các trận đấu trong giải 1123 Badminton Tournament"
        badge="Lịch trình thi đấu"
      />

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
            selectedCategoryId === "all" 
              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
              : "bg-white/50 border border-foreground/5 text-foreground/40 hover:bg-white hover:text-foreground"
          }`}
        >
          Tất cả
        </button>
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategoryId === cat.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "bg-white/50 border border-foreground/5 text-foreground/40 hover:bg-white hover:text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-bold text-sm">
          Chưa có trận đấu nào được sắp xếp.
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((tm) => {
            const match = tm.matches[0]; // Assuming 1 match per timeline node
            if (!match) return null;
            return (
              <UserMatchCard
                key={tm.id}
                order={tm.order}
                roundName={tm.round.name}
                categoryName={tm.category.name}
                match={match}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
