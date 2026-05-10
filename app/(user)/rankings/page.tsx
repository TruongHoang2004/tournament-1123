"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Loader2, TrendingUp, Swords } from "lucide-react";

interface TeamRanking {
  id: string;
  name: string;
  players: string[];
  totalPoints: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalSetPoints: number;
  categories: string[];
  doublesCount: number;
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rankings")
      .then((res) => res.json())
      .then((data) => {
        setRankings(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getRankStyle = (index: number) => {
    if (index === 0)
      return {
        badge: "bg-amber-400 text-amber-950 shadow-lg shadow-amber-200",
        row: "bg-amber-50/60 border-amber-100",
        icon: "🥇",
      };
    if (index === 1)
      return {
        badge: "bg-slate-300 text-slate-800 shadow-md shadow-slate-200",
        row: "bg-slate-50/40 border-slate-100",
        icon: "🥈",
      };
    if (index === 2)
      return {
        badge: "bg-orange-300 text-orange-900 shadow-md shadow-orange-100",
        row: "bg-orange-50/30 border-orange-100",
        icon: "🥉",
      };
    return {
      badge: "bg-slate-100 text-slate-600",
      row: "bg-white border-slate-50",
      icon: "",
    };
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Leaderboard
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-zinc-900">
            Bảng xếp hạng{" "}
            <span className="gradient-text">Toàn giải</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm max-w-2xl">
            Tổng hợp điểm số của tất cả các đội từ mọi trận đấu trong giải.
            Điểm được tính bằng tổng điểm các cặp đấu của mỗi team đạt được.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : rankings.length === 0 ? (
          <div className="glass p-16 text-center rounded-3xl">
            <Trophy className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-400 font-bold">
              Chưa có dữ liệu xếp hạng
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards (Desktop) */}
            <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
              {rankings.slice(0, 3).map((team, index) => {
                const style = getRankStyle(index);
                const order = index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3";
                const height = index === 0 ? "pt-0" : index === 1 ? "pt-8" : "pt-12";
                return (
                  <div key={team.id} className={`${order} ${height}`}>
                    <div className={`glass p-6 text-center space-y-4 border ${style.row} hover:shadow-lg transition-all`}>
                      <div className="text-4xl">{style.icon}</div>
                      <div>
                        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
                          {team.name}
                        </h3>
                        <p className="text-[10px] text-zinc-400 mt-1 font-medium">
                          {team.players.join(", ")}
                        </p>
                      </div>
                      <div className="text-4xl font-black text-primary">
                        {team.totalPoints}
                        <span className="text-sm font-bold text-zinc-400 ml-1">
                          điểm
                        </span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs font-bold">
                        <span className="text-green-600">
                          {team.totalWins}W
                        </span>
                        <span className="text-red-500">
                          {team.totalLosses}L
                        </span>
                        <span className="text-zinc-400">
                          {team.totalMatches} trận
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Rankings Table/List */}
            <div className="glass overflow-hidden">
              <div className="flex items-center gap-3 p-4 md:p-6 border-b border-zinc-100">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Medal className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight">
                  Xếp hạng chi tiết
                </h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 w-16">
                        #
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Đội
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                        Trận
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                        Thắng
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                        Thua
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                        Cặp đấu
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center" title="Tổng điểm ghi được trong các set (tiebreaker)">
                        Điểm phụ
                      </th>
                      <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary text-center">
                        Tổng điểm
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((team, index) => {
                      const style = getRankStyle(index);
                      return (
                        <tr
                          key={team.id}
                          className={`border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors ${style.row}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {style.icon ? (
                                <span className="text-lg">{style.icon}</span>
                              ) : (
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${style.badge}`}
                                >
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm font-black text-zinc-900">
                              {team.name}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              {team.players.join(", ")}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-center font-medium">
                            {team.totalMatches}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-green-600">
                            {team.totalWins}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-red-500">
                            {team.totalLosses}
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-zinc-500">
                            {team.doublesCount}
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-zinc-500">
                            {team.totalSetPoints}
                          </td>
                          <td className="py-4 px-4 text-center font-black text-primary text-xl">
                            {team.totalPoints}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="block md:hidden divide-y divide-zinc-50">
                {rankings.map((team, index) => {
                  const style = getRankStyle(index);
                  return (
                    <div
                      key={team.id}
                      className={`p-4 flex items-center gap-4 ${style.row}`}
                    >
                      {/* Rank */}
                      <div className="shrink-0">
                        {style.icon ? (
                          <span className="text-2xl">{style.icon}</span>
                        ) : (
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${style.badge}`}
                          >
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-zinc-900 truncate">
                          {team.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {team.players.join(", ")}
                        </p>
                        <div className="flex gap-3 mt-1.5 text-[10px] font-bold">
                          <span className="text-green-600 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            {team.totalWins}W
                          </span>
                          <span className="text-red-500">
                            {team.totalLosses}L
                          </span>
                          <span className="text-zinc-400 flex items-center gap-0.5">
                            <Swords className="w-3 h-3" />
                            {team.totalMatches}
                          </span>
                          <span className="text-zinc-400">Phụ: {team.totalSetPoints}</span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="shrink-0 text-right">
                        <div className="text-2xl font-black text-primary">
                          {team.totalPoints}
                        </div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                          điểm
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
