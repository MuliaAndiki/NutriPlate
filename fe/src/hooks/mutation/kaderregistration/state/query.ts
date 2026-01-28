import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetMyRegister() {
  return useQuery({
    queryFn: () => Api.KaderRegistration.getMyRegistrations(),
    queryKey: cacheKey.registrion.list(),
    staleTime: 1000 * 60 * 5,
  });
}
