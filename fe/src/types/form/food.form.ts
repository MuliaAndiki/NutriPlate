import { IFood } from "@/types/schema/food.schema";

export type FormCreateFood = Pick<
  IFood,
  "childId" | "iotId" | "photoUrl" | "totalWeightGram"
>;

export type FormUpdateFood = Pick<IFood, "id" | "photoUrl" | "totalWeightGram">;
