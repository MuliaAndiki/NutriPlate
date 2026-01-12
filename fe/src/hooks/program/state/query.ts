import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetPropgrams() {
  return useQuery({
    queryKey: cacheKey.program.list(),
    queryFn: () => Api.Program.getPrograms(),
    staleTime: 1000 * 60 * 5,
  });
}
