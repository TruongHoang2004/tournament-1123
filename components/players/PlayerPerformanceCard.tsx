import React from "react";
import { TrendingUp } from "lucide-react";

interface PlayerPerformanceCardProps {
  totalMatchesCount: number;
  winsCount: number;
  winRate: number;
}

export default function PlayerPerformanceCard({
  totalMatchesCount,
  winsCount,
  winRate
}: PlayerPerformanceCardProps) {
  const lossesCount = totalMatchesCount - winsCount;

  return (
    <div className="glass p-6 space-y-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-primary" /> Hiệu suất thi đấu
      </h3>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">Trận</span>
          <span className="text-xl font-black text-zinc-800">{totalMatchesCount}</span>
        </div>
        <div className="bg-emerald-50/40 rounded-2xl p-3 border border-emerald-100/50">
          <span className="text-[10px] font-bold text-emerald-600 block uppercase">Thắng</span>
          <span className="text-xl font-black text-emerald-700">{winsCount}</span>
        </div>
        <div className="bg-red-50/40 rounded-2xl p-3 border border-red-100/50">
          <span className="text-[10px] font-bold text-red-500 block uppercase">Thua</span>
          <span className="text-xl font-black text-red-600">{lossesCount}</span>
        </div>
      </div>

      {/* Winrate circle */}
      <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-zinc-800 uppercase tracking-wide">Tỉ lệ thắng</span>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Dựa trên tất cả các set đấu đã hoàn thành</p>
        </div>
        <div className="text-2xl font-black italic text-primary">
          {winRate}%
        </div>
      </div>
    </div>
  );
}
