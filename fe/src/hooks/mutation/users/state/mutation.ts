import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormUpdatePassword, FormUpdateProfile } from "@/types/form/auth.form";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfile() {
  const nameSpace = useAppNameSpace();

  return useMutation<TResponse<any>, Error, Partial<FormUpdateProfile>>({
    mutationFn: (payload) => Api.User.updateProfile(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update profile user",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update profile user",
        icon: "error",
      });
    },
  });
}

export function useUpdatePassword() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormUpdatePassword>({
    mutationFn: (payload) => Api.User.updatePassword(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully update password",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed update password",
        icon: "error",
      });
    },
  });
}
