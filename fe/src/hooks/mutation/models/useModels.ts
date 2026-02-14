import { usePostModelsVersion } from "./state/mutation";
import { useGetModels } from "./state/query";

export function useModels() {
  return {
    mutation: {
      postModelsVersion: usePostModelsVersion,
    },
    query: {
      getModels: useGetModels,
    },
  };
}
