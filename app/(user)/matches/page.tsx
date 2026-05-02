"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/services";
import { Loader2, Calendar, Trophy, Clock, CheckCircle2, PlayCircle } from "lucide-react";

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
  }, [selectedCategoryId]);

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

  const getStatus = (m: Match) => {
    if (m.winnerTeamId) return { label: "Finished", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle2 };
    if (m.playedAt) return { label: "Live", color: "text-amber-500 bg-amber-50", icon: PlayCircle };
    return { label: "Upcoming", color: "text-slate-400 bg-slate-50", icon: Clock };
  };

  const getScore = (m: Match) => {
    if (!m.setScores || m.setScores.length === 0) return { sA: 0, sB: 0 };
    // Nếu chỉ có 1 set, hiển thị điểm số của set đó. Nếu nhiều set, hiển thị số set thắng.
    if (m.setScores.length === 1) {
      return { sA: m.setScores[0].scoreA, sB: m.setScores[0].scoreB };
    }
    let sA = 0;
    let sB = 0;
    m.setScores.forEach(s => {
      if (s.scoreA > s.scoreB) sA++;
      else if (s.scoreB > s.scoreA) sB++;
    });
    return { sA, sB };
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
          Lịch Thi Đấu & Kết Quả
        </h1>
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
          Theo dõi tất cả các trận đấu trong giải
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${selectedCategoryId === "all" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-slate-100"}`}
        >
          Tất cả
        </button>
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${selectedCategoryId === cat.id ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-slate-100"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          Chưa có trận đấu nào được sắp xếp.
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((tm) => {
            const match = tm.matches[0]; // Assuming 1 match per timeline node
            if (!match) return null;
            const status = getStatus(match);
            const { sA, sB } = getScore(match);
            const Icon = status.icon;

            return (
              <div key={tm.id} className="group relative bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Status & Info */}
                  <div className="flex md:flex-col items-center gap-4 md:w-32">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                      <Icon size={12} />
                      {status.label}
                    </span>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tm.round.name}</div>
                      <div className="text-xs font-black text-slate-900 mt-0.5">#{tm.order}</div>
                    </div>
                  </div>

                  {/* Teams & Score */}
                  <div className="flex-1 flex items-center justify-between gap-4 w-full">
                    <div className="flex-1 flex flex-col items-end gap-1 text-right">
                      <span className="text-sm font-black text-slate-900 line-clamp-1">{match.doubleA.team.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{match.doubleA.player1.name} - {match.doubleA.player2.name}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                      <span className={`text-2xl font-black ${match.winnerTeamId === match.doubleA.teamId ? "text-slate-900" : "text-slate-300"}`}>{sA}</span>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <span className={`text-2xl font-black ${match.winnerTeamId === match.doubleB.teamId ? "text-slate-900" : "text-slate-300"}`}>{sB}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-start gap-1 text-left">
                      <span className="text-sm font-black text-slate-900 line-clamp-1">{match.doubleB.team.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{match.doubleB.player1.name} - {match.doubleB.player2.name}</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="hidden lg:flex flex-col items-end justify-center w-40">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hạng mục</span>
                    <span className="text-xs font-bold text-slate-600 truncate max-w-full">{tm.category.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
