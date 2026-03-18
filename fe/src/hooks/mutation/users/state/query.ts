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
  const canFetch = (() => {
    if (!role) return false;

    if (role === "PARENT" || role === "ADMIN") return true;

    if ((role === "POSYANDU" || role === "KADER") && !!posyanduId) {
      return true;
    }

    return false;
  })();
  return useQuery({
    queryKey: cacheKey.child.byAll(role, posyanduId),
    queryFn: () => Api.User.getChild(posyanduId),
    enabled: canFetch,
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

export function useGetProfile() {
  return useQuery({
    queryKey: cacheKey.profile.user(),
    queryFn: () => Api.User.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetParent() {
  return useQuery({
    queryKey: cacheKey.profile.parent(),
    queryFn: () => Api.User.getParent(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetParentById(id: string) {
  return useQuery({
    queryKey: cacheKey.profile.parentById(id),
    queryFn: () => Api.User.getParentByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetKaderById(id: string) {
  return useQuery({
    queryKey: cacheKey.profile.kaderById(id),
    queryFn: () => Api.User.getKaderByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

export function useGetKader() {
  return useQuery({
    queryKey: cacheKey.kader.list(),
    queryFn: () => Api.User.getKader(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetProfileById(id: string) {
  return useQuery({
    queryKey: cacheKey.user.byProfileId(id),
    queryFn: () => Api.User.getProfileByID(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
