"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/services";
import { Loader2, ArrowUp, ArrowDown, Edit, Trophy, Hash, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Match {
  id: string;
  doubleA: any;
  doubleB: any;
  winnerTeamId: string | null;
}

interface TimelineMatch {
  id: string;
  order: number;
  round: { name: string };
  category: { name: string };
  matches: Match[];
}

export default function AdminMatchesPage() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [matches, setMatches] = useState<TimelineMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

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
      toast.error("Không thể tải danh sách trận đấu");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    try {
      const res = await fetch("/api/timeline/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timelineMatchId: id, direction }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reorder");
      }

      toast.success("Đã thay đổi thứ tự");
      fetchMatches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getMatchStatus = (match: any) => {
    if (!match) return { label: "Chưa xác định", color: "bg-slate-50 text-slate-400 border-slate-200" };
    if (match.winnerTeamId) return { label: "Đã hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    if (match.playedAt) return { label: "Đang thi đấu", color: "bg-blue-50 text-blue-700 border-blue-100 animate-pulse" };
    return { label: "Chưa diễn ra", color: "bg-slate-50 text-slate-500 border-slate-200" };
  };

  const displayedMatches = matches.filter((tm) => {
    const match = tm.matches[0];
    if (!match) return true; // Hiển thị các trận TBD
    const isFinished = !!match.winnerTeamId;
    return showCompleted || !isFinished;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Quản Lý Trận Đấu
          </h1>
          <p className="text-slate-500 mt-1">Điều chỉnh thứ tự thi đấu và theo dõi tiến độ.</p>
        </div>
      </div>

      {/* Category Filter & Toggle showCompleted */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedCategoryId === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400"}`}
          >
            Tất cả
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedCategoryId === cat.id ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-150 shadow-xs">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="showCompleted" className="text-xs font-black text-slate-600 select-none cursor-pointer">
            Hiển thị trận đã hoàn thành
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile, visible on medium and larger viewports) */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Thứ tự</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trận đấu</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vòng</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hạng mục</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedMatches.map((tm, index) => {
                  const match = tm.matches[0];
                  return (
                    <tr key={tm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">
                            {tm.order}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {match ? (
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{match.doubleA.team.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-medium">{match.doubleA.player1.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-300">VS</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{match.doubleB.team.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-medium">{match.doubleB.player1.name}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">TBD (To be determined)</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {match ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${getMatchStatus(match).color}`}>
                            {getMatchStatus(match).label}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black border bg-slate-50 text-slate-400 border-slate-200">
                            Chờ đối thủ
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{tm.round.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">{tm.category.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleReorder(tm.id, "up")}
                            disabled={index === 0}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorder(tm.id, "down")}
                            disabled={index === displayedMatches.length - 1}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
                          >
                            <ArrowDown size={16} />
                          </button>
                          {match && (
                            <Link
                              href={`/admin/matches/${match.id}/score`}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-blue-600 transition-all"
                            >
                              <Edit size={16} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {displayedMatches.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm italic">
                Không có trận đấu nào hiển thị
              </div>
            )}
          </div>

          {/* Mobile Card List View (visible on mobile screens, hidden on desktop/medium+) */}
          <div className="block md:hidden space-y-4 animate-in fade-in duration-300">
            {displayedMatches.map((tm, index) => {
              const match = tm.matches[0];
              const status = getMatchStatus(match);
              return (
                <div key={tm.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                  {/* Top Bar: Order and Status badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-xl uppercase tracking-wider">
                      Trận #{tm.order}
                    </span>
                    {match ? (
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${status.color}`}>
                        {status.label}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-black border bg-slate-50 text-slate-400 border-slate-200 uppercase tracking-wider">
                        Chờ đối thủ
                      </span>
                    )}
                  </div>

                  {/* Versus Display */}
                  <div className="py-2 border-y border-slate-50">
                    {match ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-800 truncate">{match.doubleA.team.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {match.doubleA.player1.name} & {match.doubleA.player2.name}
                          </p>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 shrink-0 px-2 italic">VS</span>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-black text-slate-800 truncate">{match.doubleB.team.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {match.doubleB.player1.name} & {match.doubleB.player2.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs text-slate-400 italic">
                        Chờ cặp đấu chiến thắng (TBD)
                      </div>
                    )}
                  </div>

                  {/* Metadata: Round and Category */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <div>
                      <span className="text-slate-400 font-normal">Vòng:</span>{" "}
                      <span className="text-slate-700 font-black">{tm.round.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-normal">Hạng mục:</span>{" "}
                      <span className="text-slate-700 font-black truncate max-w-[120px] inline-block align-bottom">{tm.category.name}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReorder(tm.id, "up")}
                        disabled={index === 0}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-20 active:scale-95 transition-all"
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(tm.id, "down")}
                        disabled={index === displayedMatches.length - 1}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-20 active:scale-95 transition-all"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {match && (
                      <Link
                        href={`/admin/matches/${match.id}/score`}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md shadow-blue-100 active:scale-95"
                      >
                        <Edit size={12} />
                        Ghi điểm
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            {displayedMatches.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-white rounded-3xl border border-slate-100">
                Không có trận đấu nào hiển thị
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
