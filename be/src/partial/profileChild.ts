export interface ProfileChild {
  [key: string]: unknown;
  birthWeightKg?: number;
  birthHeightCm?: number;
  pregnancyAgeWeeks?: number;
  allergicFoods?: string[];
  chronicConditions?: string[];
  feedingType?: string;
  activityLevel?: string;
}

export interface MetricsRespone {
  [key: string]: unknown;
  precision: Number;
  recall: Number;
  mAP50: Number;
  mAP50_95: Number;
}
