import { useGetFoodSummaryDaily } from "./state/query";

export function useFoodSummary() {
  return {
    mutation: {
      //
    },
    query: {
      foodSummaryDaily: useGetFoodSummaryDaily,
    },
  };
}
