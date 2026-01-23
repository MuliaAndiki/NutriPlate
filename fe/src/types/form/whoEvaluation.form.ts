import { IWhoEvaluation } from "@/types/schema/whoEvaluation.schema";

export type FormViewWhoEvaluation = Pick<
  IWhoEvaluation,
  "childId" | "measurementId"
>;
