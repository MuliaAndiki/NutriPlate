import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useGetIotDevices() {
  return useQuery({
    queryKey: cacheKey.iot.list(),
    queryFn: () => Api.Iot.getDevices(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
  });
}

export function useGetAllIotDevices() {
  return useQuery({
    queryKey: cacheKey.iot.all(),
    queryFn: () => Api.Iot.getAllDevices(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
  });
}

export function useGetIotDeviceDetail(
  token: string,
  options?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof Api.Iot.getDeviceDetail>>,
      Error,
      Awaited<ReturnType<typeof Api.Iot.getDeviceDetail>>,
      ReturnType<typeof cacheKey.iot.device>
    >
  >,
) {
  return useQuery({
    queryKey: cacheKey.iot.device(token),
    queryFn: () => Api.Iot.getDeviceDetail(token),
    ...options,
  });
}
