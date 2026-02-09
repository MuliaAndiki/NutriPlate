import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormUpdatePassword, FormUpdateProfile } from "@/types/form/auth.form";
import { useMutation } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";

export function useUpdateProfile() {
  const nameSpace = useAppNameSpace();

  return useMutation<TResponse<any>, Error, Partial<FormUpdateProfile>>({
    mutationFn: (payload) => Api.User.updateProfile(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.profile.user(),
      });
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

export function useEditProfile() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormUpdateProfile>({
    mutationFn: (payload) => Api.User.editProfile(payload),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.profile.user(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully edit profile user",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed edit profile user",
        icon: "error",
      });
    },
  });
}

export function useDeleteAccount() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, void>({
    mutationFn: () => Api.User.deleteAccount(),
    onSuccess: () => {
      nameSpace.queryClient.invalidateQueries({
        queryKey: cacheKey.profile.user(),
      });
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully delete account",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed delete account",
        icon: "error",
      });
    },
  });
}

export function useAllReadyLogin() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, void>({
    mutationFn: () => Api.User.AllReadyLogin(),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succes",
        message: "succesfully check login status",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed check login status",
        icon: "error",
      });
    },
  });
}
