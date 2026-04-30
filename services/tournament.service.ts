import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const tournamentService = {
  getActiveTournament: async () => {
    const res = await api.get("/tournament");
    return res.data;
  },

  createTournament: async (name: string, date: string) => {
    const res = await api.post("/tournament", { name, date });
    return res.data;
  },
};

export const tournamentKeys = {
  all: ["tournaments"] as const,
  active: () => [...tournamentKeys.all, "active"] as const,
};

export function useActiveTournament() {
  return useQuery({
    queryKey: tournamentKeys.active(),
    queryFn: () => tournamentService.getActiveTournament(),
  });
}
