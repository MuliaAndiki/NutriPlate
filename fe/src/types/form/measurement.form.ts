import { IMeasurement } from "../schema/measurement.schema";

export type FormCreateMeasurement = Pick<
  IMeasurement,
  | "childId"
  | "measurementDate"
  | "weightKg"
  | "headCircumferenceCm"
  | "heightCm"
  | "note"
>;

export type FormUpdateMeasurement = Pick<
  IMeasurement,
  "id" | "weightKg" | "heightCm" | "headCircumferenceCm" | "note"
>;
