import { Sword, CheckCircle2, Award, Timer } from "lucide-react";
import TeamAvatar from "./TeamAvatar";

interface MatchCardProps {
  match: any;
  updating: boolean;
  onUpdateScore: (matchId: string, setNumber: number, scoreA: number, scoreB: number) => void;
  onFinalize: (matchId: string) => void;
}

export default function MatchCard({ match, updating, onUpdateScore, onFinalize }: MatchCardProps) {
  const isFinalized = !!match.winnerTeamId;

  return (
    <div
      className={`bg-[#0f0f0f] border rounded-3xl p-8 transition-all duration-500 ${
        isFinalized ? "border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.05)]" : "border-white/5"
      }`}
    >
      <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
        {/* Teams & Status */}
        <div className="flex items-center space-x-12 shrink-0">
          <div className="text-center w-40">
            <TeamAvatar 
              name={match.doubleA.team.name} 
              size="lg" 
              className={`mx-auto mb-4 ${match.winnerTeamId === match.doubleA.teamId ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'opacity-50'}`} 
            />
            <p className="font-bold text-white truncate">{match.doubleA.team.name}</p>
            <p className="text-[10px] text-gray-500 mt-1">{match.doubleA.player1.name} & {match.doubleA.player2.name}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-gray-400 mb-4 uppercase">
              {match.timelineMatch.category.name}
            </div>
            <Sword className="w-8 h-8 text-gray-700" />
            <div className="mt-4 text-center">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{match.timelineMatch.round.name}</p>
            </div>
          </div>

          <div className="text-center w-40">
            <TeamAvatar 
              name={match.doubleB.team.name} 
              size="lg" 
              className={`mx-auto mb-4 ${match.winnerTeamId === match.doubleB.teamId ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'opacity-50'}`} 
            />
            <p className="font-bold text-white truncate">{match.doubleB.team.name}</p>
            <p className="text-[10px] text-gray-500 mt-1">{match.doubleB.player1.name} & {match.doubleB.player2.name}</p>
          </div>
        </div>

        {/* Score Input */}
        <div className="flex-1 w-full max-w-2xl bg-black/40 rounded-2xl p-6 border border-white/5">
          <div className="grid grid-cols-3 gap-8 items-center text-center">
            {[1, 2, 3].map((setNum) => {
              const setScore = match.setScores.find((s: any) => s.setNumber === setNum) || { scoreA: 0, scoreB: 0 };
              return (
                <div key={setNum} className="space-y-4">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Set {setNum}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <input
                      type="number"
                      disabled={isFinalized || updating}
                      defaultValue={setScore.scoreA}
                      onBlur={(e) => onUpdateScore(match.id, setNum, parseInt(e.target.value), setScore.scoreB)}
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center font-black text-white focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                    <span className="text-gray-700 font-bold">:</span>
                    <input
                      type="number"
                      disabled={isFinalized || updating}
                      defaultValue={setScore.scoreB}
                      onBlur={(e) => onUpdateScore(match.id, setNum, setScore.scoreA, parseInt(e.target.value))}
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center font-black text-white focus:border-blue-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 space-y-3">
          {isFinalized ? (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
              <p className="text-xs font-black text-green-500 uppercase tracking-widest">Finalized</p>
            </div>
          ) : (
            <button
              onClick={() => onFinalize(match.id)}
              disabled={updating}
              className="w-40 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Finalize Result</span>
            </button>
          )}
          <div className="text-center">
            <p className="text-[10px] text-gray-500 flex items-center justify-center">
              <Timer className="w-3 h-3 mr-1" />
              {isFinalized ? "Completed" : "In Progress"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
