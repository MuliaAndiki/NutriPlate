import { useGetGrowthChart, useGetMeasurement } from "./state/query";

export function useMeasuremnet() {
  return {
    mutation: {
      //init
    },
    query: {
      growthChart: useGetGrowthChart,
      measurement: useGetMeasurement,
    },
  };
}
