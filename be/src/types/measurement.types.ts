import { NutritionType } from "@prisma/client";

export interface IMeasurements {
  id: string;
  childID: string;
  measurement_date: string;
  weight_kg: number;
  eight_cm: number;
  head_circumference_cm: number;
  nutrition_status: NutritionType;
  note: string;
}
