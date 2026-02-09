import {
  useGetFastApi,
  useGetHealth,
  useGetProxyStatusIot,
} from "./state/query";

export function useServices() {
  return {
    mutation: {
      //
    },
    query: {
      getFastApi: useGetFastApi,
      getHealth: useGetHealth,
      getStatusIot: useGetProxyStatusIot,
    },
  };
}
