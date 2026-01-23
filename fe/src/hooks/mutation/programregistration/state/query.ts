import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetChildStatusInPrograms() {
  return useQuery({
    queryKey: cacheKey.regisProgram.list(),
    queryFn: () => Api.ProgramRegistration.getMyProgramRegistrations(),
    staleTime: 1000 * 60 * 5,
  });
}
