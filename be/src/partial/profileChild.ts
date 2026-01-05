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
