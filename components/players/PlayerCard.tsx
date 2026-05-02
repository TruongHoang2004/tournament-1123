import { Gender, Player } from "@prisma/client";

export const PlayerCard = ({ player }: { player: any }) => {
    return (
        <div className="glass p-6 hover:border-primary transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black italic tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {player.name}
                </h3>
                <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${player.gender === Gender.MALE
                        ? "bg-secondary/10 text-secondary border border-secondary/20"
                        : "bg-magenta/10 text-magenta border border-magenta/20"
                        }`}
                >
                    {player.gender === Gender.MALE ? "Nam" : "Nữ"}
                </span>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Đội</span>
                    <span className="text-sm font-bold text-foreground/80">{player.team?.name || 'Vãng lai'}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Trình</span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-black italic">
                        {player.level}
                    </span>
                </div>
            </div>
        </div>
    );
}