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
