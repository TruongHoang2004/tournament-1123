import TeamAvatar from "./TeamAvatar";

interface TeamStats {
  id: string;
  name: string;
  totalPoints: number;
  wins: number;
  losses: number;
}

interface LeaderboardTableProps {
  teams: TeamStats[];
}

export default function LeaderboardTable({ teams }: LeaderboardTableProps) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <th className="px-8 py-5">Rank</th>
            <th className="px-8 py-5">Team</th>
            <th className="px-8 py-5">Played</th>
            <th className="px-8 py-5">W / L</th>
            <th className="px-8 py-5 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {teams.map((team, index) => (
            <tr
              key={team.id}
              className="group hover:bg-white/[0.02] transition-colors duration-200"
            >
              <td className="px-8 py-6">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                      : index === 1
                      ? "bg-gray-300 text-black"
                      : index === 2
                      ? "bg-amber-600 text-white"
                      : "text-gray-500 border border-white/10"
                  }`}
                >
                  {index + 1}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center space-x-3">
                  <TeamAvatar name={team.name} size="md" />
                  <div>
                    <div className="text-white font-bold group-hover:text-blue-400 transition-colors">
                      {team.name}
                    </div>
                    <div className="text-xs text-gray-500">Premier League</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6 text-gray-400 font-medium">
                {team.wins + team.losses}
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500 font-bold">{team.wins}</span>
                  <span className="text-gray-600 text-xs">/</span>
                  <span className="text-red-500 font-bold">{team.losses}</span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <span className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors tabular-nums">
                  {team.totalPoints}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
