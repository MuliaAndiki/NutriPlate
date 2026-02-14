import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetGrowthChart(id: string) {
  return useQuery({
    queryKey: cacheKey.evaluate.byChild(id),
    queryFn: () => Api.Measurement.getGrowth(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetMeasurement(id: string) {
  return useQuery({
    queryKey: cacheKey.measurement.byChild(id),
    queryFn: () => Api.Measurement.getMeasurement(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetAllMeasurement(posyanduId: string) {
  return useQuery({
    queryKey: cacheKey.measurement.byPosyandu(posyanduId!),
    queryFn: () => Api.Measurement.getAllMeasuremnt(posyanduId),
    staleTime: 1000 * 60 * 5,
    enabled: !!posyanduId,
  });
}
