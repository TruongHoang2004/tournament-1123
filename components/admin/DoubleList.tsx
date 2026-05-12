"use client";

import { useDoubles, useDeleteDouble } from "@/services";
import { Users, Trophy, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DoubleListProps {
  selectedTeamId?: string;
}

export function DoubleList({ selectedTeamId }: DoubleListProps) {
  const { data: doubles, isLoading: doublesLoading } = useDoubles();
  const deleteDoubleMutation = useDeleteDouble();
  const [doubleToDelete, setDoubleToDelete] = useState<any | null>(null);

  const filteredDoubles = selectedTeamId
    ? doubles?.filter((d: any) => d.teamId === selectedTeamId)
    : doubles;

  const handleDeleteClick = (double: any) => {
    setDoubleToDelete(double);
  };

  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          {selectedTeamId ? "Danh sách bộ đôi của đội" : "Danh sách các bộ đôi hiện tại"}
        </h2>
        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-zinc-200 text-zinc-600">
          {filteredDoubles?.length || 0} Bộ đôi
        </span>
      </div>

      {doublesLoading ? (
        <div className="glass p-12 flex flex-col items-center justify-center text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-sm font-bold">Đang tải dữ liệu...</p>
        </div>
      ) : filteredDoubles?.length === 0 ? (
        <div className="glass p-12 text-center text-zinc-500 border-dashed">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-bold">Chưa có bộ đôi nào được đăng ký.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDoubles?.map((double: any) => (
            <div key={double.id} className="glass p-6 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
                    {double.category?.name}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">Đội {double.team?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteClick(double)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                    title="Xóa bộ đôi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Trophy className="w-4 h-4 text-zinc-300 group-hover:text-accent transition-colors shrink-0" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-black uppercase">
                    {double.player1?.name[0]}
                  </div>
                  <span className="text-sm font-bold text-zinc-800">{double.player1?.name}</span>
                </div>

                <div className="text-[10px] font-black text-zinc-300 italic">VS</div>

                <div className="flex-1 flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-black uppercase">
                    {double.player2?.name[0]}
                  </div>
                  <span className="text-sm font-bold text-zinc-800">{double.player2?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận xóa bộ đôi */}
      {doubleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 max-w-md w-full overflow-hidden animate-in scale-in duration-200 p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-lg text-zinc-900 uppercase">Xóa bộ đôi này?</h3>
                <p className="text-xs text-zinc-500">
                  Bạn có chắc chắn muốn xóa bộ đôi <strong className="text-zinc-800">{doubleToDelete.player1?.name} & {doubleToDelete.player2?.name}</strong>?
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                <strong>⚠️ CẢNH BÁO QUAN TRỌNG:</strong> Hành động này sẽ <strong>XÓA & RESET TOÀN BỘ</strong> lịch thi đấu, kết quả set đấu, và điểm số của phân khúc <strong>{doubleToDelete.category?.name}</strong> để bảo toàn tính nhất quán của dữ liệu giải đấu.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDoubleToDelete(null)}
                disabled={deleteDoubleMutation.isPending}
                className="px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteDoubleMutation.mutateAsync(doubleToDelete.id);
                    toast.success("Đã xóa bộ đôi và tự động reset lịch thi đấu liên quan.");
                  } catch (err: any) {
                    toast.error(err.message || "Lỗi khi xóa bộ đôi");
                  } finally {
                    setDoubleToDelete(null);
                  }
                }}
                disabled={deleteDoubleMutation.isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {deleteDoubleMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Xác nhận xóa & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
