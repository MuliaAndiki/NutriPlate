import { cacheKey } from "@/configs/cache.config";
import Api from "@/services/props.module";
import { useQuery } from "@tanstack/react-query";

export function useGetMyRegister() {
  return useQuery({
    queryFn: () => Api.KaderRegistration.getMyRegistrations(),
    queryKey: cacheKey.registrion.myRegister(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetPendingRegister() {
  return useQuery({
    queryFn: () => Api.KaderRegistration.getPendingRegistrations(),
    queryKey: cacheKey.registrion.pending(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAcceptedRegister() {
  return useQuery({
    queryFn: () => Api.KaderRegistration.getAcceptedRegistrations(),
    queryKey: cacheKey.registrion.accepted(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetRejectRegister() {
  return useQuery({
    queryFn: () => Api.KaderRegistration.getRejectedRegistion(),
    queryKey: cacheKey.registrion.reject(),
    staleTime: 1000 * 60 * 5,
  });
}
