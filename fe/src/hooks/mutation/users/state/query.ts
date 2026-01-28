import { useQuery } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { Role } from "@/types/partial";

export function useGetChild({
  role,
  posyanduId,
}: {
  role?: Role;
  posyanduId?: string;
}) {
  const canFetch =
    role === "PARENT" ||
    role === "ADMIN" ||
    ((role === "POSYANDU" || role === "KADER") && !!posyanduId);
  // helper
  console.log({ role, posyanduId, canFetch });
  return useQuery({
    queryKey: ["child", role, posyanduId],
    queryFn: () => Api.User.getChild(posyanduId),
    enabled: canFetch,
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

export function useGetProfile() {
  return useQuery({
    queryKey: cacheKey.profile.user(),
    queryFn: () => Api.User.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}
