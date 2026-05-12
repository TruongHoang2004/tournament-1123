import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface UserMatchCardProps {
  order: number;
  roundName: string;
  categoryName: string;
  match: {
    id: string;
    winnerTeamId: string | null;
    playedAt: string | null;
    doubleA: {
      teamId: string;
      team: { name: string };
      player1: { name: string };
      player2: { name: string };
    };
    doubleB: {
      teamId: string;
      team: { name: string };
      player1: { name: string };
      player2: { name: string };
    };
    setScores: Array<{
      id: string;
      scoreA: number;
      scoreB: number;
    }>;
  };
}

export default function UserMatchCard({ order, roundName, categoryName, match }: UserMatchCardProps) {
  const getStatus = () => {
    if (match.winnerTeamId) return { label: "Đã xong", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2 };
    if (match.playedAt) return { label: "Live", color: "text-amber-600 bg-amber-50 border-amber-100 animate-pulse", icon: PlayCircle };
    return { label: "Chờ đấu", color: "text-slate-400 bg-slate-50 border-slate-100", icon: Clock };
  };

  const getScore = () => {
    if (!match.setScores || match.setScores.length === 0) return { sA: 0, sB: 0 };
    // Single-set format: return actual points. Multi-set: return games won
    if (match.setScores.length === 1) {
      return { sA: match.setScores[0].scoreA, sB: match.setScores[0].scoreB };
    }
    let sA = 0;
    let sB = 0;
    match.setScores.forEach((s) => {
      if (s.scoreA > s.scoreB) sA++;
      else if (s.scoreB > s.scoreA) sB++;
    });
    return { sA, sB };
  };

  const status = getStatus();
  const { sA, sB } = getScore();
  const Icon = status.icon;

  const isWinnerA = match.winnerTeamId === match.doubleA.teamId;
  const isWinnerB = match.winnerTeamId === match.doubleB.teamId;

  const showForfeitA = !!match.winnerTeamId && isWinnerB && sA > sB;
  const showForfeitB = !!match.winnerTeamId && isWinnerA && sB > sA;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200 p-5 md:p-6 hover:shadow-xl hover:shadow-slate-100 hover:border-primary/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* Status & Info */}
        <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 w-full md:w-32 pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-slate-100">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${status.color}`}>
            <Icon size={12} />
            {status.label}
          </span>
          <div className="text-right md:text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{roundName}</div>
            <div className="text-xs font-black text-slate-900 mt-0.5">Trận #{order}</div>
          </div>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 flex items-center justify-between gap-4 w-full">
          {/* Team A */}
          <div className="flex-1 flex flex-col items-end gap-1 text-right min-w-0">
            <div className="flex items-center gap-1.5 justify-end w-full">
              {showForfeitA && (
                <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-500 border border-red-100/30">
                  Bỏ cuộc / Chấn thương
                </span>
              )}
              <span className={`text-sm font-black text-slate-900 truncate ${isWinnerA ? "text-primary" : ""}`}>
                {match.doubleA.player1.name} & {match.doubleA.player2.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-full">
              Đội {match.doubleA.team.name}
            </span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-3 md:gap-4 bg-slate-50 px-4 md:px-6 py-2.5 rounded-2xl border border-slate-150 shrink-0">
            <span className={`text-xl md:text-2xl font-black ${isWinnerA ? "text-primary" : "text-slate-400"}`}>{sA}</span>
            <div className="w-px h-6 bg-slate-200"></div>
            <span className={`text-xl md:text-2xl font-black ${isWinnerB ? "text-primary" : "text-slate-400"}`}>{sB}</span>
          </div>

          {/* Team B */}
          <div className="flex-1 flex flex-col items-start gap-1 text-left min-w-0">
            <div className="flex items-center gap-1.5 justify-start w-full">
              <span className={`text-sm font-black text-slate-900 truncate ${isWinnerB ? "text-primary" : ""}`}>
                {match.doubleB.player1.name} & {match.doubleB.player2.name}
              </span>
              {showForfeitB && (
                <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-500 border border-red-100/30">
                  Bỏ cuộc / Chấn thương
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-full">
              Đội {match.doubleB.team.name}
            </span>
          </div>
        </div>

        {/* Category Info */}
        <div className="hidden lg:flex flex-col items-end justify-center w-52 border-l border-slate-100 pl-6 text-right">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hạng mục</span>
          <span className="text-xs font-black text-slate-600 mt-0.5 whitespace-normal break-words">{categoryName}</span>
        </div>
      </div>

      {/* Set Scores Detail Dropdown/Footer if multiple sets exist */}
      {match.setScores && match.setScores.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span>Chi tiết set:</span>
          {match.setScores.map((set, sIdx) => (
            <span key={set.id} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-slate-600 font-bold">
              S{sIdx + 1}({set.scoreA}-{set.scoreB})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
