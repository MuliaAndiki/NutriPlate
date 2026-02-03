import { useUpdatePassword, useUpdateProfile } from "./state/mutation";
import {
  useGetChild,
  useGetChildById,
  useGetParent,
  useGetParentById,
  useGetProfile,
} from "./state/query";

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
      parent: useGetParent,
      parentById: useGetParentById,
    },
  };
}
