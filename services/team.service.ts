import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const teamService = {
  getAll: async () => {
    const res = await api.get("/teams");
    return res.data;
  },

  getAllByTournament: async (tournamentId: string) => {
    const res = await api.get("/teams", { params: { tournamentId } });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/teams/${id}`);
    return res.data;
  },

  updateName: async (id: string, name: string) => {
    const res = await api.patch(`/teams/${id}`, { name });
    return res.data;
  },
};

export const teamKeys = {
  all: ["teams"] as const,
  list: (tournamentId: string) => [...teamKeys.all, "list", { tournamentId }] as const,
  detail: (id: string) => [...teamKeys.all, "detail", id] as const,
};

export function useTeams(tournamentId: string | undefined) {
  return useQuery({
    queryKey: teamKeys.list(tournamentId!),
    queryFn: () => teamService.getAllByTournament(tournamentId!),
    enabled: !!tournamentId,
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamService.getById(id),
    enabled: !!id,
  });
}

export function useAllTeams() {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: () => teamService.getAll(),
  });
}
