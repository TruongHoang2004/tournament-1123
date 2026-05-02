"use client";

import { useState, useMemo } from "react";
import { useDoubles, useTeams, useCategories } from "@/services";
import { DoublesHero } from "@/components/doubles/DoublesHero";
import { DoublesFilters } from "@/components/doubles/DoublesFilters";
import { DoublesGrid } from "@/components/doubles/DoublesGrid";

export default function DoublesPage() {
    const { data: doubles, isLoading: doublesLoading } = useDoubles();
    const { data: teams } = useTeams();
    const { data: categories } = useCategories();

    const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDoubles = useMemo(() => {
        if (!doubles) return [];
        return doubles.filter((double: any) => {
            const matchTeam = selectedTeamId === "all" || double.teamId === selectedTeamId;
            const matchCategory = selectedCategoryId === "all" || double.categoryId === selectedCategoryId;
            const matchSearch = searchQuery === "" ||
                double.player1?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                double.player2?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                double.team?.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchTeam && matchCategory && matchSearch;
        });
    }, [doubles, selectedTeamId, selectedCategoryId, searchQuery]);

    return (
        <div className="min-h-screen pb-20">
            <DoublesHero />

            <DoublesFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTeamId={selectedTeamId}
                setSelectedTeamId={setSelectedTeamId}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                teams={teams || []}
                categories={categories || []}
                count={filteredDoubles.length}
            />

            <section className="max-w-7xl mx-auto px-6">
                <DoublesGrid doubles={filteredDoubles} isLoading={doublesLoading} />
            </section>
        </div>
    );
}
