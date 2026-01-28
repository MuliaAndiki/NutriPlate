import { useQuery } from "@tanstack/react-query";
import Api from "@/services/props.module";
import { cacheKey } from "@/configs/cache.config";

export function useGetFoodSummaryDaily(id: string) {
  return useQuery({
    queryKey: cacheKey.foodSummaryDaily.byChild(id),
    queryFn: () => Api.FoodSummary.getFoodSummaryDaily(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetFoodSummaryByRange(
  id: string,
  params: { startDate: string; endDate: string },
) {
  return useQuery({
    queryKey: cacheKey.foodSummaryDaily.byRange(id, params),
    queryFn: () => Api.FoodSummary.getFoodSummaryRange(id, params),
    staleTime: 1000 * 60 * 5,
    enabled: !!id && !!params.startDate && !!params.endDate,
  });
}
