import { useGetHistoryFoodIntake } from "./state/query";

export function useFoodIntake() {
  return {
    mutation: {
      // logic mutatiom
    },
    query: {
      getHistoryFoodIntake: useGetHistoryFoodIntake,
    },
  };
}
