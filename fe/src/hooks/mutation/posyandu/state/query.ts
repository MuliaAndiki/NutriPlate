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

export function useGetPosyanduById(id: string) {
  return useQuery({
    queryKey: cacheKey.posyandu.byId(id),
    queryFn: () => Api.Posyandu.getPosyanduByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetKaderByPosyandu() {
  return useQuery({
    queryKey: cacheKey.posyandu.kaderList(),
    queryFn: () => Api.Posyandu.getKaderListByPosyandu(),
    staleTime: 1000 * 60 * 5,
  });
}
