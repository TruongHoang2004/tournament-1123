"use client";

import { useState } from "react";
import { useDoubles } from "@/services";
import { Loader2, Users, Save, Play } from "lucide-react";
import { toast } from "sonner";

interface GroupAssignmentProps {
  selectedCategoryId: string;
}

export function GroupAssignment({ selectedCategoryId }: GroupAssignmentProps) {
  const { data: doubles, refetch } = useDoubles();
  
  // Filter doubles for the selected category
  const categoryDoubles = doubles?.filter((d: any) => d.categoryId === selectedCategoryId) || [];
  
  // Local state to track group assignments before saving
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
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

      const res = await fetch("/api/doubles/assign-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: selectedCategoryId, assignments: payload })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi khi lưu bảng đấu");
      }

      toast.success("Lưu bảng đấu thành công!");
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitBracket = async () => {
    setIsInitializing(true);
    try {
      const res = await fetch("/api/tournament/init-bracket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: selectedCategoryId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi khi khởi tạo lịch thi đấu");
      }

      toast.success("Khởi tạo lịch thi đấu thành công!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleEndGroupStage = async () => {
    try {
      const res = await fetch("/api/tournament/end-group-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: selectedCategoryId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi khi chốt vòng bảng");
      }

      toast.success("Đã chốt vòng bảng! Các cặp đấu Bán kết đã được tạo tự động.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

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
        <button
          onClick={handleEndGroupStage}
          className="w-full bg-zinc-900 text-white font-bold py-3 rounded-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Kết thúc Vòng Bảng (Tạo Bán kết)
        </button>
      </div>
      
      {categoryDoubles.length !== 6 && (
        <p className="text-[10px] text-center text-red-500 mt-2">
            * Cần đăng ký đủ 6 đội cho nội dung này để tạo lịch thi đấu (Hiện có: {categoryDoubles.length})
        </p>
      )}
    </div>
  );
}
