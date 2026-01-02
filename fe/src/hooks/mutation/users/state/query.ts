import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetChild() {
  return useQuery({
    queryKey: cacheKey.child.list(),
    queryFn: () => Api.User.getChild(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetChildById(id: string) {
  return useQuery({
    queryKey: cacheKey.child.byID(id),
    queryFn: () => Api.User.getChildByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
