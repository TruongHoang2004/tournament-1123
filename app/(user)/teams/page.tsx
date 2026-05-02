"use client";

import { useAllTeams } from "@/services";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionHeader from "@/components/shared/SectionHeader";
import TeamCard from "@/components/tournament/TeamCard";
import { Users, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function TeamsPage() {
    const { data: teams = [], isLoading } = useAllTeams();
    const [searchQuery, setSearchQuery] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const filteredTeams = teams.filter((team: any) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.players.some((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 lg:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
                <SectionHeader
                    title="Danh sách đội"
                    subtitle="Các đội tuyển đang tham gia tranh tài tại giải đấu"
                    badge={`${teams.length} Đội tuyển`}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
                        <h3 className="text-2xl font-black italic tracking-tight text-foreground uppercase">
                            Đội hình tham dự
                        </h3>
                    </div>
                    <div className="flex gap-4 items-center w-full md:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm tên đội hoặc thành viên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/40 backdrop-blur-md border border-foreground/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-sm text-foreground font-medium placeholder:text-foreground/30 shadow-sm"
                            />
                        </div>
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md border border-foreground/10 text-foreground/60 hover:text-primary hover:border-primary/40 transition-all shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTeams.map((team: any) => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                ) : (
                    <div className="glass p-20 text-center flex flex-col items-center gap-6 rounded-3xl border-dashed border-2 border-foreground/10">
                        <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center animate-pulse">
                            <Users className="w-10 h-10 text-foreground/10" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-foreground/60 font-black uppercase tracking-[0.2em] text-sm">
                                Không tìm thấy đội tuyển nào
                            </p>
                            <p className="text-foreground/30 text-xs font-medium">
                                Hãy thử tìm kiếm với tên đội hoặc tên thành viên khác.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
