import { NutritionStatus } from "../partial";

export interface MeasurementRespone {
  id: string;
  childId: string;
  measurementDate: Date;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
  nutritionStatus: NutritionStatus;
  note?: string;
  createdAt: Date;
}

export interface MeasurementDetailResponse extends MeasurementRespone {}

export interface CreateMeasurementResponse {
  status: number;
  message: string;
  data: MeasurementDetailResponse;
}

export interface GetMeasurementResponse {
  status: number;
  message: string;
  data: MeasurementDetailResponse[];
}

export interface GetMeasurementByIDResponse {
  status: number;
  message: string;
  data: MeasurementDetailResponse;
}

export interface UpdateMeasurementResponse {
  status: number;
  message: string;
  data: MeasurementDetailResponse;
}

export interface WhoEvaluationResponse {
  id: string;
  childId: string;
  measurementId: string;
  ageMonths: number;
  heightCm: number;
  weightKg: number;
  zScore: number;
  classification?: any;
  recommendation?: any;
  createdAt: Date;
}

export interface GetGrowthChartResponse {
  status: number;
  message: string;
  data: WhoEvaluationResponse[];
}
