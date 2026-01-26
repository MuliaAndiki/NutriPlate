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

export function useGetChildInProgram(id: string) {
  return useQuery({
    queryKey: cacheKey.progres.byChildList(id),
    queryFn: () => Api.Progres.getChildInProgram(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
