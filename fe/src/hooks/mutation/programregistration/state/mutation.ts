import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import {
  FormAcceptProgramRegistration,
  FormRegisterChildToProgram,
  FormRejectProgramRegistration,
} from "@/types/form";
import { useMutation } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";

export function useRegisterChildToProgram() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormRegisterChildToProgram>({
    mutationFn: (payload) =>
      Api.ProgramRegistration.registerChildToProgram(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.regisProgram.list(),
      });
      nameSpace.alert.toast({
        title: "succesfully",
        message: "succes register child in program",
        icon: "success",
      });
    },
    onError: (err) => {
      console.log(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed register child in program",
        icon: "error",
      });
    },
  });
}

export function useAcceptProgramRegistration() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormAcceptProgramRegistration>({
    mutationFn: (payload) =>
      Api.ProgramRegistration.acceptProgramRegistration(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.regisProgram.list(),
      });
      nameSpace.alert.toast({
        title: "succesfully",
        message: "succes accept program registration",
        icon: "success",
      });
    },
    onError: (err) => {
      console.log(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed accept program registration",
        icon: "error",
      });
    },
  });
}

export function useRejectProgramRegistration() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormRejectProgramRegistration>({
    mutationFn: (payload) =>
      Api.ProgramRegistration.rejectProgramRegistration(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.regisProgram.list(),
      });
      nameSpace.alert.toast({
        title: "succesfully",
        message: "succes reject program registration",
        icon: "success",
      });
    },
    onError: (err) => {
      console.log(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed reject program registration",
        icon: "error",
      });
    },
  });
}
