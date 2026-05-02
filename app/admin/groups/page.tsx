"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Users, Trophy, Shuffle, CheckCircle2, AlertCircle } from "lucide-react";

interface Team {
  id: string;
  name: string;
  doubles: any[];
}

export default function AssignGroupsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groupA, setGroupA] = useState<string[]>([]);
  const [groupB, setGroupB] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đội");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTeam = (teamId: string) => {
    if (groupA.includes(teamId)) {
      setGroupA(groupA.filter((id) => id !== teamId));
    } else if (groupB.includes(teamId)) {
      setGroupB(groupB.filter((id) => id !== teamId));
    } else {
      // Add to group A if space, otherwise B if space
      if (groupA.length < 3) {
        setGroupA([...groupA, teamId]);
      } else if (groupB.length < 3) {
        setGroupB([...groupB, teamId]);
      } else {
        toast.error("Mỗi bảng chỉ tối đa 3 đội");
      }
    }
  };

  const handleAutoAssign = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    setGroupA(shuffled.slice(0, 3).map((t) => t.id));
    setGroupB(shuffled.slice(3, 6).map((t) => t.id));
  };

  const handleSubmit = async () => {
    if (groupA.length !== 3 || groupB.length !== 3) {
      toast.error("Vui lòng chọn đúng 3 đội cho mỗi bảng");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/doubles/assign-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupA, groupB }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(data.message || "Bốc bảng thành công!");
      router.push("/admin/matches"); // Redirect to matches page or similar
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bốc Bảng Thi Đấu
          </h1>
          <p className="text-slate-500 mt-1">
            Chọn 3 đội cho Bảng A và 3 đội cho Bảng B. Hệ thống sẽ tự động tạo các trận đấu vòng tròn.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAutoAssign}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
          >
            <Shuffle className="w-4 h-4" />
            Bốc ngẫu nhiên
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || groupA.length !== 3 || groupB.length !== 3}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-indigo-200 transition-all duration-200"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
            Xác nhận & Tạo trận đấu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Teams Pool */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            Danh sách Đội ({teams.length})
          </div>
          <div className="grid grid-cols-1 gap-3">
            {teams.map((team) => {
              const isAssigned = groupA.includes(team.id) || groupB.includes(team.id);
              const whichGroup = groupA.includes(team.id) ? "A" : groupB.includes(team.id) ? "B" : null;

              return (
                <button
                  key={team.id}
                  onClick={() => handleToggleTeam(team.id)}
                  className={`
                    group p-4 rounded-xl border text-left transition-all duration-200
                    ${isAssigned
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md active:scale-95"}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{team.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {team.doubles?.length || 0} bộ đôi đăng ký
                      </div>
                    </div>
                    {whichGroup && (
                      <span className={`
                        px-2 py-1 rounded text-xs font-bold
                        ${whichGroup === "A" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}
                      `}>
                        Bảng {whichGroup}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Groups Display */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group A */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">A</div>
                  Bảng A
                </h3>
                <span className="text-blue-600 font-medium">{groupA.length}/3</span>
              </div>

              <div className="min-h-[300px] space-y-3">
                {groupA.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-blue-300 py-12 border-2 border-dashed border-blue-200 rounded-xl">
                    <Users className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Chưa có đội nào</p>
                  </div>
                ) : (
                  groupA.map((teamId) => {
                    const team = teams.find((t) => t.id === teamId);
                    return (
                      <div key={teamId} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                        <span className="font-semibold text-slate-700">{team?.name}</span>
                        <button
                          onClick={() => setGroupA(groupA.filter(id => id !== teamId))}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {groupA.length === 3 && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs flex items-start gap-2 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Bảng A đã sẵn sàng. 3 trận đấu sẽ được tạo giữa các đội này.</span>
              </div>
            )}
          </div>

          {/* Group B */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">B</div>
                  Bảng B
                </h3>
                <span className="text-purple-600 font-medium">{groupB.length}/3</span>
              </div>

              <div className="min-h-[300px] space-y-3">
                {groupB.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-purple-300 py-12 border-2 border-dashed border-purple-200 rounded-xl">
                    <Users className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Chưa có đội nào</p>
                  </div>
                ) : (
                  groupB.map((teamId) => {
                    const team = teams.find((t) => t.id === teamId);
                    return (
                      <div key={teamId} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                        <span className="font-semibold text-slate-700">{team?.name}</span>
                        <button
                          onClick={() => setGroupB(groupB.filter(id => id !== teamId))}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {groupB.length === 3 && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs flex items-start gap-2 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Bảng B đã sẵn sàng. 3 trận đấu sẽ được tạo giữa các đội này.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-bold mb-1">Lưu ý quan trọng:</p>
          <p>
            Việc xác nhận bốc bảng sẽ xóa tất cả các trận đấu vòng bảng hiện có (nếu có) và tạo mới hoàn toàn dựa trên sự phân bổ đội này.
            Các trận đấu trong mỗi hạng mục sẽ được tạo tự động nếu có đủ 3 bộ đôi từ 3 đội khác nhau trong cùng một bảng.
          </p>
        </div>
      </div>
    </div>
  );
}
