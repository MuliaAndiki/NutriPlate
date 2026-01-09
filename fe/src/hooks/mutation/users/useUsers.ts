import { useUpdatePassword, useUpdateProfile } from "./state/mutation";
import { useGetChild, useGetChildById, useGetProfile } from "./state/query";

export function useUsers() {
  return {
    mutation: {
      updateProfile: useUpdateProfile,
      updatePassword: useUpdatePassword,
    },
    query: {
      childAll: useGetChild,
      childById: useGetChildById,
      profile: useGetProfile,
    },
  };
}
