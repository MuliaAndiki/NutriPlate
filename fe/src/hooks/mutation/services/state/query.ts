import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetFastApi() {
  return useQuery({
    queryKey: cacheKey.services.fastApi(),
    queryFn: () => Api.Proxy.getFastApi(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetHealth() {
  return useQuery({
    queryKey: cacheKey.services.health(),
    queryFn: () => Api.Proxy.getHealth(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetProxyStatusIot() {
  return useQuery({
    queryKey: cacheKey.services.statusIot(),
    queryFn: () => Api.Proxy.getStatusIot(),
    staleTime: 1000 * 60 * 5,
  });
}
