import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { GetWeightIorRespone } from "@/types/res";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useGetIotStatus() {
  return useQuery({
    queryKey: cacheKey.iot.byItem(),
    queryFn: () => Api.Iot.statusIot(),
    staleTime: 1000 * 60 * 5,
  });
}
export function useGetWeight(
  options?: Partial<
    UseQueryOptions<
      GetWeightIorRespone,
      Error,
      GetWeightIorRespone,
      ReturnType<typeof cacheKey.iot.weight>
    >
  >,
) {
  return useQuery({
    queryKey: cacheKey.iot.weight(),
    queryFn: async () => {
      const res = await Api.Iot.getWeight();
      return res.data;
    },
    ...options,
  });
}
