import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const teamService = {
  getAll: async () => {
    const res = await api.get("/teams");
    return res.data;
  },

  getAllByTournament: async () => {
    const res = await api.get("/teams");
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
  list: () => [...teamKeys.all, "list"] as const,
  detail: (id: string) => [...teamKeys.all, "detail", id] as const,
};

export function useTeams() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: () => teamService.getAllByTournament(),
    enabled: true,
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
