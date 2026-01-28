import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetPosyandu() {
  return useQuery({
    queryKey: cacheKey.posyandu.list(),
    queryFn: () => Api.Posyandu.getPosyandu(),
    staleTime: 1000 * 60 * 5,
  });
}
