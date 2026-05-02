"use client";

import { useState } from "react";
import { usePlayers } from "@/services";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Users, UserCheck, UserMinus, Search } from "lucide-react";
import { Gender } from "@prisma/client";
import { PlayerCard } from "@/components/players/PlayerCard";

export default function PlayersPage() {
    const { data: players, isLoading } = usePlayers();
    const [searchQuery, setSearchQuery] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!players) return null;

    // Filtering logic
    const filteredPlayers = players.filter((player: any) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPlayers = players.length;
    const malePlayers = players.filter((p: any) => p.gender === Gender.MALE).length;
    const femalePlayers = players.filter((p: any) => p.gender === Gender.FEMALE).length;

    return (
        <div className="p-6 lg:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
                <SectionHeader
                    title="Vận Động Viên"
                    subtitle="Danh sách tất cả các vận động viên tham gia giải đấu 1123"
                    badge="Danh sách chính thức"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        label="Tổng số VĐV"
                        value={totalPlayers}
                        icon={Users}
                        iconColor="text-primary"
                    />
                    <StatCard
                        label="Nam"
                        value={malePlayers}
                        icon={UserCheck}
                        iconColor="text-secondary"
                    />
                    <StatCard
                        label="Nữ"
                        value={femalePlayers}
                        icon={UserMinus}
                        iconColor="text-magenta"
                    />
                </div>

                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
                            <h3 className="text-2xl font-black italic tracking-tight text-foreground uppercase">
                                Danh sách VĐV
                            </h3>
                        </div>
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên hoặc đội..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/40 backdrop-blur-md border border-foreground/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all text-sm text-foreground font-medium placeholder:text-foreground/30 shadow-sm"
                            />
                        </div>
                    </div>

                    {filteredPlayers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPlayers.map((player: any) => (
                                <PlayerCard key={player.id} player={player} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass p-20 text-center flex flex-col items-center gap-6 rounded-3xl border-dashed border-2 border-foreground/10">
                            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center animate-pulse">
                                <Users className="w-10 h-10 text-foreground/10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-foreground/60 font-black uppercase tracking-[0.2em] text-sm">
                                    Không tìm thấy kết quả
                                </p>
                                <p className="text-foreground/30 text-xs font-medium">
                                    Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}