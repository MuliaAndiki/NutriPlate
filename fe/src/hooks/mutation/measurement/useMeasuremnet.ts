import { useCreateMeasuremnt, useUpdateMeasurement } from "./state/mutation";
import {
  useGetAllMeasurement,
  useGetGrowthChart,
  useGetMeasurement,
} from "./state/query";

export function useMeasuremnet() {
  return {
    mutation: {
      createMeasuremnt: useCreateMeasuremnt,
      updateMeasuremnet: useUpdateMeasurement,
    },
    query: {
      growthChart: useGetGrowthChart,
      measurement: useGetMeasurement,
      allMeasurement: useGetAllMeasurement,
    },
  };
}
