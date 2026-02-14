import { useGetPropgrams, useGetPropgramsByID } from "./state/query";
import {
  useCreateProgram,
  useDeleteProgram,
  useUpdateProgram,
} from "./state/mutation";

export function useProgram() {
  return {
    mutation: {
      createProgram: useCreateProgram,
      updateProgram: useUpdateProgram,
      deleteProgram: useDeleteProgram,
    },
    query: {
      getPrograms: useGetPropgrams,
      getProgramById: useGetPropgramsByID,
    },
  };
}
