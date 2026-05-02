import { Trophy } from "lucide-react";

interface DoubleCardProps {
  double: any;
}

export function DoubleCard({ double }: DoubleCardProps) {
  return (
    <div className="glass p-8 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-500"></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20 w-fit">
            {double.category?.name}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Đội {double.team?.name}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:text-primary transition-colors border border-zinc-100">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center mb-8 relative z-10">
        {/* Players side by side */}
        <div className="flex items-center justify-center gap-6">
          {/* Player 1 */}
          <div className="flex flex-col items-center gap-3 flex-1 group/player">
            <div className="w-16 h-16 rounded-full bg-zinc-100 border-4 border-white shadow-sm flex items-center justify-center text-xl font-black text-zinc-400 group-hover/player:bg-primary group-hover/player:text-white transition-all duration-300">
              {double.player1?.name[0]}
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-zinc-900 group-hover/player:text-primary transition-colors">{double.player1?.name}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Vận động viên 1</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-20 bg-zinc-100 self-center"></div>

          {/* Player 2 */}
          <div className="flex flex-col items-center gap-3 flex-1 group/player">
            <div className="w-16 h-16 rounded-full bg-zinc-100 border-4 border-white shadow-sm flex items-center justify-center text-xl font-black text-zinc-400 group-hover/player:bg-primary group-hover/player:text-white transition-all duration-300">
              {double.player2?.name[0]}
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-zinc-900 group-hover/player:text-primary transition-colors">{double.player2?.name}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Vận động viên 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}