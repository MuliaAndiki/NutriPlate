import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetTask(id: string) {
  return useQuery({
    queryKey: cacheKey.task.byProgresId(id),
    queryFn: () => Api.Task.getTaskForChild(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
