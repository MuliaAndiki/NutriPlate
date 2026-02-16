import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrent() {
  return useQuery({
    queryFn: () => Api.Session.getSessionCurent(),
    queryKey: cacheKey.session.active(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetList() {
  return useQuery({
    queryFn: () => Api.Session.getAllSession(),
    queryKey: cacheKey.session.list(),
    staleTime: 1000 * 60 * 5,
  });
}
