import React from "react";

export interface Double {
  id: string;
  teamId: string;
  team: {
    name: string;
  };
  player1: {
    name: string;
    gender: string;
    level: number;
  };
  player2: {
    name: string;
    gender: string;
    level: number;
  };
  category: {
    name: string;
  };
}

interface DoubleDetailCardProps {
  double: Double;
}

export default function DoubleDetailCard({ double }: DoubleDetailCardProps) {
  return (
    <div className="glass p-6 text-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary to-orange-400" />

      {/* Double Badge Icon */}
      <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-3xl font-black text-primary italic shadow-sm shadow-primary/5">
        👥
      </div>

      <div>
        <h2 className="text-xl font-black italic uppercase tracking-tight text-zinc-900 leading-snug">
          {double.player1.name} <br /> & <br /> {double.player2.name}
        </h2>
        <p className="text-xs font-bold text-zinc-400 mt-2 uppercase tracking-wider">
          Đội {double.team.name}
        </p>
        <span className="inline-block mt-3 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
          {double.category.name}
        </span>
      </div>

      {/* Players Info Split */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">VĐV 1</span>
          <span className="text-xs font-black text-zinc-800 block truncate">{double.player1.name}</span>
          <span className="text-[10px] font-medium text-zinc-500 block">
            {double.player1.gender === "MALE" ? "Nam" : "Nữ"} - Trình {double.player1.level}
          </span>
        </div>
        <div className="space-y-1 text-right border-l border-zinc-100 pl-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">VĐV 2</span>
          <span className="text-xs font-black text-zinc-800 block truncate">{double.player2.name}</span>
          <span className="text-[10px] font-medium text-zinc-500 block">
            {double.player2.gender === "MALE" ? "Nam" : "Nữ"} - Trình {double.player2.level}
          </span>
        </div>
      </div>
    </div>
  );
}
