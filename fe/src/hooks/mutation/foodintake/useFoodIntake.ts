import {
  useGetHistoryFoodIntake,
  useGetHistoryFoodIntakeById,
} from "./state/query";
import { useCreateFoodIntake } from "./state/mutation";

export function useFoodIntake() {
  return {
    mutation: {
      createFoodIntake: useCreateFoodIntake,
    },
    query: {
      getHistoryFoodIntake: useGetHistoryFoodIntake,
      getHistoryFoodIntakeById: useGetHistoryFoodIntakeById,
    },
  };
}
