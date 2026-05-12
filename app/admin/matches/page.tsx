"use client";

import { useState, useEffect } from "react";
import { useCategories, useEndGroupStage } from "@/services";
import { Loader2, ArrowUp, ArrowDown, Edit, Trophy, Hash, Settings, X, AlertTriangle, Check, Play } from "lucide-react";
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

  // State for End Group Stage modal & overrides
  const endGroupStageMutation = useEndGroupStage();
  const [showEndModal, setShowEndModal] = useState(false);
  const [standings, setStandings] = useState<{ groupA: any[], groupB: any[] } | null>(null);
  const [groupA1, setGroupA1] = useState<string>("");
  const [groupA2, setGroupA2] = useState<string>("");
  const [groupB1, setGroupB1] = useState<string>("");
  const [groupB2, setGroupB2] = useState<string>("");
  const [isEnding, setIsEnding] = useState(false);
  const [isLoadingStandings, setIsLoadingStandings] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [selectedCategoryId]);

  const handleEndGroupStage = async () => {
    if (selectedCategoryId === "all") {
      toast.error("Vui lòng chọn một nội dung thi đấu cụ thể (không chọn 'Tất cả') để chốt vòng bảng.");
      return;
    }
    setIsLoadingStandings(true);
    try {
      const res = await fetch(`/api/standings?categoryId=${selectedCategoryId}`);
      if (!res.ok) throw new Error("Không thể tải bảng xếp hạng hiện tại");
      const data = await res.json();
      setStandings(data);
      
      if (data.groupA && data.groupA.length >= 2) {
        setGroupA1(data.groupA[0].doubleId);
        setGroupA2(data.groupA[1].doubleId);
      }
      if (data.groupB && data.groupB.length >= 2) {
        setGroupB1(data.groupB[0].doubleId);
        setGroupB2(data.groupB[1].doubleId);
      }
      setShowEndModal(true);
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi chốt vòng bảng");
    } finally {
      setIsLoadingStandings(false);
    }
  };

  const handleEndGroupStageWithSelections = async () => {
    if (!groupA1 || !groupA2 || !groupB1 || !groupB2) {
      toast.error("Vui lòng chọn đầy đủ các đội đi tiếp");
      return;
    }

    if (groupA1 === groupA2) {
      toast.error("Vui lòng chọn 2 cặp đấu khác nhau cho Nhất và Nhì bảng A");
      return;
    }

    if (groupB1 === groupB2) {
      toast.error("Vui lòng chọn 2 cặp đấu khác nhau cho Nhất và Nhì bảng B");
      return;
    }

    setIsEnding(true);
    try {
      await endGroupStageMutation.mutateAsync({
        categoryId: selectedCategoryId,
        overrides: {
          groupA1,
          groupA2,
          groupB1,
          groupB2
        }
      });

      toast.success("Đã chốt vòng bảng! Các cặp đấu Bán kết đã được tạo thành công.");
      setShowEndModal(false);
      fetchMatches();
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi chốt vòng bảng");
    } finally {
      setIsEnding(false);
    }
  };

  const checkHasTie = (group: any[]) => {
    if (!group || group.length < 2) return false;
    const pointsList = group.map(t => t.points);
    return new Set(pointsList).size !== pointsList.length;
  };

  const hasTieA = standings ? checkHasTie(standings.groupA) : false;
  const hasTieB = standings ? checkHasTie(standings.groupB) : false;
  const hasAnyTie = hasTieA || hasTieB;

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
        
        {selectedCategoryId !== "all" && (
          <button
            onClick={handleEndGroupStage}
            disabled={isLoadingStandings}
            className="px-6 py-3 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-2 self-start md:self-auto shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoadingStandings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Kết thúc Vòng Bảng (Tạo Bán kết)
          </button>
        )}
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
                              <span className="text-sm font-bold text-slate-800">{match.doubleA.player1.name} & {match.doubleA.player2.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Đội {match.doubleA.team.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-300">VS</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{match.doubleB.player1.name} & {match.doubleB.player2.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Đội {match.doubleB.team.name}</span>
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
                          <p className="text-sm font-black text-slate-800 truncate">{match.doubleA.player1.name} & {match.doubleA.player2.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            Đội {match.doubleA.team.name}
                          </p>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 shrink-0 px-2 italic">VS</span>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-black text-slate-800 truncate">{match.doubleB.player1.name} & {match.doubleB.player2.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            Đội {match.doubleB.team.name}
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
      {/* Modal Chốt Vòng Bảng và Chọn Đội Đi Tiếp */}
      {showEndModal && standings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 max-w-2xl w-full overflow-hidden animate-in scale-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
                <div>
                  <h3 className="font-black text-lg text-zinc-900 uppercase">Xác nhận đội đi tiếp vào Bán Kết</h3>
                  <p className="text-xs text-zinc-500">Xem bảng xếp hạng và xác nhận các vị trí nhất/nhì bảng để tạo vòng Knockout.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEndModal(false)}
                className="p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {hasAnyTie && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 space-y-1">
                    <p className="font-bold">⚠️ Phát hiện các đội bằng điểm nhau!</p>
                    <p>Hệ thống phát hiện có các cặp đấu đồng điểm trong vòng bảng. Ban Tổ Chức (Admin) vui lòng xem xét và chủ động chọn đúng cặp Nhất và Nhì bảng đi tiếp dựa trên luật ưu tiên hoặc phân định riêng.</p>
                  </div>
                </div>
              )}

              {/* Grid 2 Bảng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* BẢNG A */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <h4 className="font-black text-sm text-blue-600 uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">A</span>
                      BẢNG A
                    </h4>
                    {hasTieA && <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Bằng điểm</span>}
                  </div>

                  {/* Standing List A */}
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 space-y-2">
                    {standings.groupA.map((item, idx) => (
                      <div key={item.doubleId} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-400">#{idx + 1}</span>
                          <div>
                            <p className="font-bold text-zinc-800">{item.player1Name} & {item.player2Name}</p>
                            <p className="text-[9px] text-zinc-400">Đội {item.teamName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-blue-600">{item.points} Đ</p>
                          <p className="text-[9px] text-zinc-400">Hiệu số: {item.pointsScored}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Select advancing A */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Nhất bảng A</label>
                      <select 
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
                        value={groupA1}
                        onChange={(e) => setGroupA1(e.target.value)}
                      >
                        {standings.groupA.map(item => (
                          <option key={item.doubleId} value={item.doubleId}>
                            {item.player1Name} & {item.player2Name} ({item.teamName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Nhì bảng A</label>
                      <select 
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
                        value={groupA2}
                        onChange={(e) => setGroupA2(e.target.value)}
                      >
                        {standings.groupA.map(item => (
                          <option key={item.doubleId} value={item.doubleId}>
                            {item.player1Name} & {item.player2Name} ({item.teamName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* BẢNG B */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <h4 className="font-black text-sm text-purple-600 uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">B</span>
                      BẢNG B
                    </h4>
                    {hasTieB && <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Bằng điểm</span>}
                  </div>

                  {/* Standing List B */}
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 space-y-2">
                    {standings.groupB.map((item, idx) => (
                      <div key={item.doubleId} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-400">#{idx + 1}</span>
                          <div>
                            <p className="font-bold text-zinc-800">{item.player1Name} & {item.player2Name}</p>
                            <p className="text-[9px] text-zinc-400">Đội {item.teamName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-purple-600">{item.points} Đ</p>
                          <p className="text-[9px] text-zinc-400">Hiệu số: {item.pointsScored}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Select advancing B */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Nhất bảng B</label>
                      <select 
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-purple-500"
                        value={groupB1}
                        onChange={(e) => setGroupB1(e.target.value)}
                      >
                        {standings.groupB.map(item => (
                          <option key={item.doubleId} value={item.doubleId}>
                            {item.player1Name} & {item.player2Name} ({item.teamName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Nhì bảng B</label>
                      <select 
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-purple-500"
                        value={groupB2}
                        onChange={(e) => setGroupB2(e.target.value)}
                      >
                        {standings.groupB.map(item => (
                          <option key={item.doubleId} value={item.doubleId}>
                            {item.player1Name} & {item.player2Name} ({item.teamName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-zinc-50">
              <button 
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-100 text-zinc-700 text-sm font-bold transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleEndGroupStageWithSelections}
                disabled={isEnding}
                className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {isEnding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Xác nhận & Tạo Bán Kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
