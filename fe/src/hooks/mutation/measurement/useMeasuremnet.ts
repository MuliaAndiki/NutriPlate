import { useCreateMeasuremnt } from "./state/mutation";
import {
  useGetAllMeasurement,
  useGetGrowthChart,
  useGetMeasurement,
} from "./state/query";

export function useMeasuremnet() {
  return {
    mutation: {
      createMeasuremnt: useCreateMeasuremnt,
    },
    query: {
      growthChart: useGetGrowthChart,
      measurement: useGetMeasurement,
      allMeasurement: useGetAllMeasurement,
    },
  };
}
