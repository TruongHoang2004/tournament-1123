"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Loader2, ChevronLeft, Trophy, 
  RotateCcw, PlayCircle, Plus, Minus, Save, Flag
} from "lucide-react";
import Link from "next/link";

interface SetScore {
  setNumber: number;
  scoreA: number;
  scoreB: number;
}

interface Match {
  id: string;
  doubleA: any;
  doubleB: any;
  winnerTeamId: string | null;
  playedAt: string | null;
  setScores: SetScore[];
  timelineMatch: {
    round: { name: string };
    category: { name: string };
  };
}

// Sub-component to avoid hooks-in-loop error
function SetScoreRow({ 
  setNum, 
  currentSet, 
  onSave,
  onChange
}: { 
  setNum: number; 
  currentSet: { scoreA: number, scoreB: number }; 
  onSave: (setNum: number, sA: number, sB: number) => void;
  onChange: (scoreA: number, scoreB: number) => void;
}) {
  const [sA, setSA] = useState(currentSet.scoreA);
  const [sB, setSB] = useState(currentSet.scoreB);

  useEffect(() => {
    setSA(currentSet.scoreA);
    setSB(currentSet.scoreB);
  }, [currentSet.scoreA, currentSet.scoreB]);

  const updateSA = (val: number) => {
    setSA(val);
    onChange(val, sB);
  };

  const updateSB = (val: number) => {
    setSB(val);
    onChange(sA, val);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Set {setNum}</span>
        {(sA !== currentSet.scoreA || sB !== currentSet.scoreB) && (
          <button 
            onClick={() => onSave(setNum, sA, sB)}
            className="text-blue-600 text-xs font-black uppercase flex items-center gap-1"
          >
            <Save className="w-3 h-3" /> Lưu
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Team A Score Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => updateSA(Math.max(0, sA - 1))}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-4xl font-black w-12 text-center text-slate-800">{sA}</div>
          <button 
            onClick={() => updateSA(sA + 1)}
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="text-slate-200 font-thin text-4xl">:</div>

        {/* Team B Score Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => updateSB(sB + 1)}
            className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
          <div className="text-4xl font-black w-12 text-center text-slate-800">{sB}</div>
          <button 
            onClick={() => updateSB(Math.max(0, sB - 1))}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MatchScoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempScores, setTempScores] = useState<Record<number, { scoreA: number; scoreB: number }>>({});
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("");
  const [isManualWinner, setIsManualWinner] = useState(false);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`);
      if (!res.ok) throw new Error("Match not found");
      const data = await res.json();
      setMatch(data);

      // Initialize tempScores from the fetched match's setScores
      const initial: Record<number, { scoreA: number; scoreB: number }> = {};
      let setsWonA = 0;
      let setsWonB = 0;
      data.setScores?.forEach((s: any) => {
        initial[s.setNumber] = { scoreA: s.scoreA, scoreB: s.scoreB };
        if (s.scoreA > s.scoreB) setsWonA++;
        else if (s.scoreB > s.scoreA) setsWonB++;
      });
      setTempScores(initial);

      // Tự động chọn đề xuất nếu admin chưa chọn thủ công
      if (!isManualWinner) {
        setSelectedWinnerId(setsWonA >= setsWonB ? data.doubleA.teamId : data.doubleB.teamId);
      }
    } catch (error) {
      toast.error("Không tìm thấy trận đấu");
      router.push("/admin/matches");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = async (setNumber: number, scoreA: number, scoreB: number) => {
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateScore", setNumber, scoreA, scoreB }),
      });
      if (!res.ok) throw new Error("Failed to update score");
      toast.success(`Đã cập nhật Set ${setNumber}`);
      fetchMatch();
    } catch (error) {
      toast.error("Lỗi khi cập nhật điểm");
    }
  };

  const handleFinalize = async () => {
    if (!confirm("Xác nhận kết thúc trận đấu và chốt kết quả?")) return;
    setSaving(true);
    try {
      const scoresPayload = Object.entries(tempScores).map(([setNumber, score]) => ({
        setNumber: parseInt(setNumber),
        scoreA: score.scoreA,
        scoreB: score.scoreB
      }));

      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "finalize",
          scores: scoresPayload,
          winnerTeamId: selectedWinnerId // Luôn gửi đội thắng do admin chỉ định
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi khi chốt kết quả");
      }

      toast.success("Trận đấu đã kết thúc!");
      router.push("/admin/matches");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi chốt kết quả");
    } finally {
      setSaving(false);
    }
  };

  const handleStartMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "startMatch" }),
      });
      if (!res.ok) throw new Error("Failed to start match");
      toast.success("Trận đấu đã bắt đầu!");
      fetchMatch();
    } catch (error) {
      toast.error("Lỗi khi bắt đầu trận đấu");
    }
  };

  const handleResetMatch = async () => {
    if (!confirm("Bạn có chắc chắn muốn reset trận đấu? Toàn bộ điểm số sẽ bị xóa.")) return;
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetMatch" }),
      });
      if (!res.ok) throw new Error("Failed to reset match");
      toast.success("Đã reset trận đấu");
      fetchMatch();
    } catch (error) {
      toast.error("Lỗi khi reset trận đấu");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!match) return null;

  const isFinished = !!match.winnerTeamId;
  const isLive = !!match.playedAt && !isFinished;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/admin/matches" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-black uppercase tracking-widest text-slate-400">Ghi Điểm Trận Đấu</h1>
          <div className="text-xs font-bold text-slate-600">{match.timelineMatch.category.name} - {match.timelineMatch.round.name}</div>
        </div>
        <button onClick={handleResetMatch} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors" title="Reset">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        {/* Teams Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`bg-white p-6 rounded-3xl border-2 transition-all ${match.winnerTeamId === match.doubleA.teamId ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-transparent shadow-sm"}`}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto font-black text-xl">A</div>
              <div className="font-black text-slate-800 text-lg leading-tight">{match.doubleA.team.name}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {match.doubleA.player1.name} <br/> {match.doubleA.player2.name}
              </div>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-3xl border-2 transition-all ${match.winnerTeamId === match.doubleB.teamId ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-transparent shadow-sm"}`}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto font-black text-xl">B</div>
              <div className="font-black text-slate-800 text-lg leading-tight">{match.doubleB.team.name}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {match.doubleB.player1.name} <br/> {match.doubleB.player2.name}
              </div>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        {!isFinished && !isLive && (
          <button 
            onClick={handleStartMatch}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <PlayCircle className="w-5 h-5" />
            Bắt đầu trận đấu
          </button>
        )}

        {/* Score Entry Section */}
        {(isLive || isFinished) && (
          <div className="space-y-4">
            {[1].map((setNum) => {
              const currentSet = match.setScores.find(s => s.setNumber === setNum) || { scoreA: 0, scoreB: 0 };
              return (
                <SetScoreRow 
                  key={setNum} 
                  setNum={setNum} 
                  currentSet={currentSet} 
                  onSave={handleUpdateScore} 
                  onChange={(sA, sB) => {
                    setTempScores(prev => ({
                      ...prev,
                      [setNum]: { scoreA: sA, scoreB: sB }
                    }));
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Quyết định đội thắng (Luôn hiển thị) */}
        {isLive && match && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Quyết định đội chiến thắng</h3>
              <p className="text-xs text-slate-400 font-medium">Hệ thống đề xuất dựa trên điểm số, nhưng bạn có toàn quyền thay đổi trước khi chốt kết quả.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedWinnerId(match.doubleA.teamId);
                  setIsManualWinner(true);
                }}
                className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  selectedWinnerId === match.doubleA.teamId
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                {match.doubleA.team.name}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedWinnerId(match.doubleB.teamId);
                  setIsManualWinner(true);
                }}
                className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                  selectedWinnerId === match.doubleB.teamId
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                {match.doubleB.team.name}
              </button>
            </div>
          </div>
        )}

        {/* Finalize Button */}
        {isLive && (
          <div className="pt-2">
            <button 
              onClick={handleFinalize}
              disabled={saving || !selectedWinnerId}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Flag className="w-6 h-6" />}
              Kết thúc trận & Chốt kết quả
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4 px-8">
              Lưu ý: Kết quả sau khi chốt sẽ tự động cập nhật bảng xếp hạng và sơ đồ thi đấu.
            </p>
          </div>
        )}

        {isFinished && (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-800 uppercase tracking-tight">Trận đấu đã kết thúc</h3>
              <p className="text-sm font-medium text-emerald-600 mt-1">Đội thắng: {match.winnerTeamId === match.doubleA.teamId ? match.doubleA.team.name : match.doubleB.team.name}</p>
            </div>
            <button 
              onClick={() => router.push("/admin/matches")}
              className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold hover:bg-emerald-200 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
