import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetModels() {
  return useQuery({
    queryKey: cacheKey.models.list(),
    queryFn: () => Api.Models.getModels(),
    staleTime: 1000 * 60 * 5,
  });
}
