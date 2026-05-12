"use client";

import { useState } from "react";
import { useDoubles, useAssignGroups, useInitBracket, useEndGroupStage } from "@/services";
import { Loader2, Users, Save, Play, Trophy, X, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

interface GroupAssignmentProps {
  selectedCategoryId: string;
}

export function GroupAssignment({ selectedCategoryId }: GroupAssignmentProps) {
  const { data: doubles, refetch } = useDoubles();
  const assignGroupsMutation = useAssignGroups();
  const initBracketMutation = useInitBracket();
  const endGroupStageMutation = useEndGroupStage();
  
  // Filter doubles for the selected category
  const categoryDoubles = doubles?.filter((d: any) => d.categoryId === selectedCategoryId) || [];
  
  // Local state to track group assignments before saving
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // State for End Group Stage modal & overrides
  const [showEndModal, setShowEndModal] = useState(false);
  const [standings, setStandings] = useState<{ groupA: any[], groupB: any[] } | null>(null);
  const [groupA1, setGroupA1] = useState<string>("");
  const [groupA2, setGroupA2] = useState<string>("");
  const [groupB1, setGroupB1] = useState<string>("");
  const [groupB2, setGroupB2] = useState<string>("");
  const [isEnding, setIsEnding] = useState(false);
  const [isLoadingStandings, setIsLoadingStandings] = useState(false);
  
  // Initialize state from data
  useState(() => {
    if (categoryDoubles.length > 0) {
        const initial: Record<string, string | null> = {};
        categoryDoubles.forEach((d: any) => initial[d.id] = d.group);
        setAssignments(initial);
    }
  });

  const handleGroupChange = (doubleId: string, group: string | null) => {
    setAssignments(prev => ({ ...prev, [doubleId]: group }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = Object.keys(assignments).map(id => ({
        doubleId: id,
        group: assignments[id] === "null" ? null : assignments[id]
      }));

      await assignGroupsMutation.mutateAsync({
        categoryId: selectedCategoryId,
        assignments: payload
      });

      toast.success("Lưu bảng đấu thành công!");
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi lưu bảng đấu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitBracket = async () => {
    setIsInitializing(true);
    try {
      await initBracketMutation.mutateAsync(selectedCategoryId);
      toast.success("Khởi tạo lịch thi đấu thành công!");
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi khởi tạo lịch thi đấu");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleEndGroupStage = async () => {
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

  if (!selectedCategoryId) {
    return (
      <div className="glass p-8 text-center text-zinc-500 border-dashed">
        <p className="text-sm font-bold">Vui lòng chọn một nội dung thi đấu để chia bảng.</p>
      </div>
    );
  }

  if (categoryDoubles.length === 0) {
    return (
      <div className="glass p-8 text-center text-zinc-500 border-dashed">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-sm font-bold">Chưa có cặp đấu nào trong nội dung này.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Quản lý vòng đấu</h2>
        <div className="flex gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white px-2 py-1 rounded">
            {categoryDoubles.length}/6 Cặp đấu
            </span>
        </div>
      </div>

      <div className="space-y-3">
        {categoryDoubles.map((double: any) => (
          <div key={double.id} className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-100">
            <div>
              <p className="text-sm font-bold">{double.player1?.name} & {double.player2?.name}</p>
              <p className="text-[10px] text-zinc-500">Đội {double.team?.name}</p>
            </div>
            
            <select
              className="bg-white border border-zinc-200 rounded px-3 py-1 outline-none focus:border-primary text-sm font-bold"
              value={assignments[double.id] || "null"}
              onChange={(e) => handleGroupChange(double.id, e.target.value)}
            >
              <option value="null">Chưa xếp</option>
              <option value="A">Bảng A</option>
              <option value="B">Bảng B</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
        <div className="flex gap-3">
            <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-white border border-zinc-200 text-zinc-900 font-bold py-3 rounded-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu bảng đấu
            </button>
            <button
            onClick={handleInitBracket}
            disabled={isInitializing || categoryDoubles.length !== 6}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            title={categoryDoubles.length !== 6 ? "Cần đủ 6 đội mới có thể tạo lịch thi đấu" : ""}
            >
            {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Tạo lịch thi đấu
            </button>
        </div>
      </div>
      
      {categoryDoubles.length !== 6 && (
        <p className="text-[10px] text-center text-red-500 mt-2">
            * Cần đăng ký đủ 6 đội cho nội dung này để tạo lịch thi đấu (Hiện có: {categoryDoubles.length})
        </p>
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
