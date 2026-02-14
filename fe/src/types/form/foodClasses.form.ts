import { IFoodClasses } from "@/types/schema/foodClasses.schema";

export type FormViewFoodClass = Pick<
  IFoodClasses,
  "id" | "name" | "energyKcal" | "proteinGram" | "fatGram" | "carbGram"
>;
