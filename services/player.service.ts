import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const playerService = {
  getAll: async () => {
    const res = await api.get("/players");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/players/${id}`);
    return res.data;
  },
};

export const playerKeys = {
  all: ["players"] as const,
  list: () => [...playerKeys.all, "list"] as const,
  detail: (id: string) => [...playerKeys.all, "detail", id] as const,
};

export function usePlayers() {
  return useQuery({
    queryKey: playerKeys.list(),
    queryFn: () => playerService.getAll(),
  });
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: playerKeys.detail(id),
    queryFn: () => playerService.getById(id),
    enabled: !!id,
  });
}
