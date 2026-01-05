import { IMeasurement } from "../schema/measurement.schema";

export type FormcreateMeasurement = Pick<
  IMeasurement,
  | "childId"
  | "measurementDate"
  | "weightKg"
  | "headCircumferenceCm"
  | "heightCm"
  | "note"
>;
