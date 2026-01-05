import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetGrowthChart(id: string) {
  return useQuery({
    queryKey: cacheKey.evaluate.byChild(id),
    queryFn: () => Api.Measurement.getEvaluation(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
