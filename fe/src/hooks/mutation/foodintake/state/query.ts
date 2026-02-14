import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetHistoryFoodIntake() {
  return useQuery({
    queryKey: cacheKey.foodIntake.list(),
    queryFn: () => Api.FoodIntake.getHistoryFood(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetHistoryFoodIntakeById(id: string) {
  return useQuery({
    queryKey: cacheKey.foodIntake.byId(id),
    queryFn: () => Api.FoodIntake.getHistoryFoodByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
