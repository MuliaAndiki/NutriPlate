import {
  useAllReadyLogin,
  useDeleteAccount,
  useEditProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "./state/mutation";
import {
  useGetChild,
  useGetChildById,
  useGetKader,
  useGetKaderById,
  useGetParent,
  useGetParentById,
  useGetProfile,
  useGetProfileById,
} from "./state/query";

export function useUsers() {
  return {
    mutation: {
      updateProfile: useUpdateProfile,
      updatePassword: useUpdatePassword,
      editProfile: useEditProfile,
      deleteAccount: useDeleteAccount,
      allReadyLogin: useAllReadyLogin,
    },
    query: {
      childAll: useGetChild,
      childById: useGetChildById,
      profile: useGetProfile,
      profileById: useGetProfileById,
      parent: useGetParent,
      parentById: useGetParentById,
      kader: useGetKader,
      kaderById: useGetKaderById,
    },
  };
}
