import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateDoubleInput {
  player1Id: string;
  player2Id: string;
  teamId: string;
  categoryId: string;
  point: number;
}

export const doubleService = {
  getAll: async () => {
    const res = await api.get("/doubles");
    return res.data;
  },

  create: async (data: CreateDoubleInput) => {
    const res = await api.post("/doubles", data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/doubles/${id}`);
    return res.data;
  },
};

export const doubleKeys = {
  all: ["doubles"] as const,
  list: () => [...doubleKeys.all, "list"] as const,
};

export function useDoubles() {
  return useQuery({
    queryKey: doubleKeys.list(),
    queryFn: () => doubleService.getAll(),
  });
}

export function useCreateDouble() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDoubleInput) => doubleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubleKeys.all });
    },
  });
}

export function useDeleteDouble() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doubleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubleKeys.all });
    },
  });
}
