import React from "react";

export interface Player {
  id: string;
  name: string;
  gender: string;
  level: number;
  team: {
    name: string;
  } | null;
}

interface PlayerDetailCardProps {
  player: Player;
}

export default function PlayerDetailCard({ player }: PlayerDetailCardProps) {
  return (
    <div className="glass p-6 text-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary to-orange-400" />

      {/* Avatar / Initial badge */}
      <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-3xl font-black text-primary italic shadow-sm shadow-primary/5">
        {player.name.substring(0, 1)}
      </div>

      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-zinc-900">{player.name}</h2>
        <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
          {player.team?.name || "VĐV Tự do"}
        </p>
      </div>

      {/* Profile specifications */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Giới tính</span>
          <span className="text-sm font-bold text-zinc-800">{player.gender === "MALE" ? "Nam" : "Nữ"}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Trình độ</span>
          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-black">
            {player.level}
          </span>
        </div>
      </div>
    </div>
  );
}
