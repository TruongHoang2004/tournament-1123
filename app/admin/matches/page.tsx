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

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Thứ tự</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trận đấu</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vòng</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hạng mục</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matches.map((tm, index) => {
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
                          disabled={index === matches.length - 1}
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
        </div>
      )}
    </div>
  );
}
