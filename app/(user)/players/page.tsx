"use client";

import { useState, useMemo } from "react";
import { usePlayers } from "@/services";
import SectionHeader from "@/components/shared/SectionHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Gender } from "@prisma/client";
import { PlayerStats } from "@/components/players/PlayerStats";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { PlayerList } from "@/components/players/PlayerList";

export default function PlayersPage() {
    const { data: players, isLoading } = usePlayers();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGender, setSelectedGender] = useState<string>("ALL");
    const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
    const [selectedTeam, setSelectedTeam] = useState<string>("ALL");

    // Extract unique teams and levels for filters
    const filterOptions = useMemo(() => {
        if (!players) return { teams: [], levels: [] };
        const teams = Array.from(new Set(players.map((p: any) => p.team?.name).filter(Boolean))).sort() as string[];
        const levels = Array.from(new Set(players.map((p: any) => p.level))).sort((a: any, b: any) => a - b) as number[];
        return { teams, levels };
    }, [players]);

    const filteredPlayers = useMemo(() => {
        if (!players) return [];
        return players.filter((player: any) => {
            const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                player.team?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = selectedGender === "ALL" || player.gender === selectedGender;
            const matchesLevel = selectedLevel === "ALL" || player.level.toString() === selectedLevel;
            const matchesTeam = selectedTeam === "ALL" || player.team?.name === selectedTeam;
            return matchesSearch && matchesGender && matchesLevel && matchesTeam;
        });
    }, [players, searchQuery, selectedGender, selectedLevel, selectedTeam]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!players) return null;

    const stats = {
        total: players.length,
        male: players.filter((p: any) => p.gender === Gender.MALE).length,
        female: players.filter((p: any) => p.gender === Gender.FEMALE).length,
    };

    const hasActiveFilters = searchQuery !== "" || selectedGender !== "ALL" || selectedLevel !== "ALL" || selectedTeam !== "ALL";

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedGender("ALL");
        setSelectedLevel("ALL");
        setSelectedTeam("ALL");
    };

    return (
        <div className="p-6 lg:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
                <SectionHeader
                    title="Vận Động Viên"
                    subtitle="Danh sách tất cả các vận động viên tham gia giải đấu 1123"
                    badge="Danh sách chính thức"
                />

                <PlayerStats {...stats} />

                <div className="space-y-8">
                    <PlayerFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedGender={selectedGender}
                        onGenderChange={setSelectedGender}
                        selectedLevel={selectedLevel}
                        onLevelChange={setSelectedLevel}
                        selectedTeam={selectedTeam}
                        onTeamChange={setSelectedTeam}
                        options={filterOptions}
                        hasActiveFilters={hasActiveFilters}
                        onReset={resetFilters}
                    />

                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_12px_rgba(232,118,45,0.4)]"></div>
                        <h3 className="text-2xl font-black italic tracking-tight text-foreground uppercase">
                            Kết quả ({filteredPlayers.length})
                        </h3>
                    </div>

                    <PlayerList players={filteredPlayers} />
                </div>
            </div>
        </div>
    );
}