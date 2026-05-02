import { Users } from "lucide-react";
import { PlayerCard } from "./PlayerCard";

interface PlayerListProps {
  players: any[];
}

export function PlayerList({ players }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="glass p-20 text-center flex flex-col items-center gap-6 rounded-3xl border-dashed border-2 border-foreground/10">
        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center animate-pulse">
          <Users className="w-10 h-10 text-foreground/10" />
        </div>
        <div className="space-y-2">
          <p className="text-foreground/60 font-black uppercase tracking-[0.2em] text-sm">
            Không tìm thấy kết quả
          </p>
          <p className="text-foreground/30 text-xs font-medium">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
}
