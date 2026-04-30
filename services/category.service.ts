import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const categoryService = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
};

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.getAll(),
  });
}
