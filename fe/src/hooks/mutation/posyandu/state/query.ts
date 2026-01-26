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

export function useGetChildrenInPosyandu(id: string | null) {
  return useQuery({
    queryKey: cacheKey.posyandu.children(id ?? "none"),
    queryFn: () => Api.Posyandu.getChildren(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
