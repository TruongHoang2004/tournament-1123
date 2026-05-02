"use client";

import { useDoubles } from "@/services";
import { Users, Trophy, Loader2 } from "lucide-react";

interface DoubleListProps {
  selectedTeamId?: string;
}

export function DoubleList({ selectedTeamId }: DoubleListProps) {
  const { data: doubles, isLoading: doublesLoading } = useDoubles();

  const filteredDoubles = selectedTeamId
    ? doubles?.filter((d: any) => d.teamId === selectedTeamId)
    : doubles;

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
                <Trophy className="w-4 h-4 text-zinc-300 group-hover:text-accent transition-colors" />
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
    </div>
  );
}
