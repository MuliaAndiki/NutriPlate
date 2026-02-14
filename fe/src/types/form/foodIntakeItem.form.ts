import { IFoodIntakeItem } from "@/types/schema/foodIntakeItem.schema";

export type FormCreateFoodIntakeItem = Pick<
  IFoodIntakeItem,
  | "foodIntakeId"
  | "foodClassName"
  | "mlConfidence"
  | "areaRatio"
  | "weightGram"
  | "energyKcal"
  | "proteinGram"
  | "fatGram"
  | "carbGram"
>;

export type FormUpdateFoodIntakeItem = Pick<
  IFoodIntakeItem,
  "id" | "weightGram" | "energyKcal" | "proteinGram" | "fatGram" | "carbGram"
>;
