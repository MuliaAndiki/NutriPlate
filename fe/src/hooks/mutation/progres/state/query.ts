import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetChildInProgramsById(id: string) {
  return useQuery({
    queryKey: cacheKey.progres.byID(id),
    queryFn: () => Api.Progres.getChildInProgramById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetChildInProgram() {
  return useQuery({
    queryKey: cacheKey.progres.list(),
    queryFn: () => Api.Progres.getChildInProgram(),
    staleTime: 1000 * 60 * 5,
  });
}
