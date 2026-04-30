"use client";

import { useEffect, useState } from "react";
import { CategoryCode } from "@prisma/client";
import { ChevronRight, Trophy, Users, Sword } from "lucide-react";
import { useCategories, useActiveTournament, useTimeline } from "@/services";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/shared/EmptyState";
import TeamAvatar from "@/components/tournament/TeamAvatar";

interface TimelineMatch {
  id: string;
  roundOrder: number;
  round: { name: string; pointWin: number };
  matches: any[];
  doubleA?: any;
  doubleB?: any;
}

export default function BracketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryCode | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: tData } = useActiveTournament();

  const tournamentId = tData?.tournament?.id;
  const { data: timeline = [], isLoading: loading } = useTimeline(tournamentId, selectedCategory);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].code);
    }
  }, [categories, selectedCategory]);

  const rounds = timeline.reduce((acc: any, match: TimelineMatch) => {
    const roundIdx = match.roundOrder;
    if (!acc[roundIdx]) acc[roundIdx] = { name: match.round.name, matches: [] };
    acc[roundIdx].matches.push(match);
    return acc;
  }, {});

  const roundList = Object.values(rounds);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Tournament Brackets" 
          subtitle="Visual progression tree for each category" 
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <button
              key={cat.code}
              onClick={() => setSelectedCategory(cat.code)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedCategory === cat.code
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              {cat.name.replace("Doubles", "")}
            </button>
          ))}
        </div>
      </div>

      {roundList.length === 0 ? (
        <EmptyState 
          icon={Sword} 
          message="No brackets yet" 
          description="Brackets have not been generated for this category yet." 
        />
      ) : (
        <div className="flex flex-nowrap overflow-x-auto pb-12 no-scrollbar gap-12 scroll-smooth">
          {roundList.map((round: any, rIndex) => (
            <div key={rIndex} className="flex-none w-72 space-y-8">
              <div className="text-center">
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  {round.name}
                </span>
              </div>

              <div className="space-y-6">
                {round.matches.map((tm: TimelineMatch) => {
                  const activeMatch = tm.matches[0];
                  return (
                    <div
                      key={tm.id}
                      className="group relative bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <TeamAvatar name={activeMatch?.doubleA?.team?.name || "?"} size="sm" />
                            <span className={`text-sm font-semibold truncate ${activeMatch?.winnerTeamId === activeMatch?.doubleA?.teamId ? "text-blue-400" : "text-gray-400"}`}>
                              {activeMatch?.doubleA?.team?.name || "TBD"}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white bg-white/5 px-2 py-0.5 rounded-md">
                            {activeMatch?.setScores?.reduce((acc: any, s: any) => acc + (s.scoreA > s.scoreB ? 1 : 0), 0) || 0}
                          </span>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <TeamAvatar name={activeMatch?.doubleB?.team?.name || "?"} size="sm" />
                            <span className={`text-sm font-semibold truncate ${activeMatch?.winnerTeamId === activeMatch?.doubleB?.teamId ? "text-blue-400" : "text-gray-400"}`}>
                              {activeMatch?.doubleB?.team?.name || "TBD"}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white bg-white/5 px-2 py-0.5 rounded-md">
                            {activeMatch?.setScores?.reduce((acc: any, s: any) => acc + (s.scoreB > s.scoreA ? 1 : 0), 0) || 0}
                          </span>
                        </div>
                      </div>

                      {rIndex < roundList.length - 1 && (
                        <div className="absolute top-1/2 -right-12 w-12 h-px bg-white/10 group-hover:bg-blue-500/30 transition-colors" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
