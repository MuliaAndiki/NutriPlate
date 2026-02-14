import { NutritionStatus } from '@prisma/client';

// Food Intake related types
export interface FoodDetection {
  class: string;
  class_id: number;
  confidence: number;
  bounding_box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  area_ratio: number;
}

export interface DetectionResponse {
  success: boolean;
  detections: FoodDetection[];
  image_size: {
    width: number;
    height: number;
  };
  model_info: {
    name: string;
    version: string;
    threshold: number;
  };
}

export interface FoodIntakeItemPayload {
  foodClassName: string;
  mlConfidence: number;
  areaRatio: number;
  weightGram: number;
  energyKcal?: number;
  proteinGram?: number;
  fatGram?: number;
  carbGram?: number;
  fiberGram?: number;
  metadata?: Record<string, any>;
}

export interface CreateFoodIntakePayload {
  childId: string;
  iotId?: string;
  photoUrl?: string;
  totalWeightGram: number;
  imageFile?: File | Buffer;
}

export interface FoodIntakeResponse {
  success: boolean;
  foodIntakeId: string;
  childId: string;
  totalWeightGram: number;
  items: Array<{
    foodClassName: string;
    weightGram: number;
    energyKcal?: number;
    proteinGram?: number;
    fatGram?: number;
    carbGram?: number;
    mlConfidence: number;
  }>;
  metadata: {
    modelVersion: string;
    detectionCount: number;
    processingTime: number;
  };
}

// Daily Food Intake Summary (READ-ONLY)
export interface FoodIntakeDailySummaryItem {
  foodClassName: string;
  weightGram: number;
  mlConfidence: number;
  energyKcal: number;
  proteinGram: number;
  fatGram: number;
  carbGram: number;
  fiberGram: number;
  calciumMg: number;
  ironMg: number;
  vitaminA: number;
  vitaminC: number;
  timestamp: Date;
}

export interface FoodIntakeDailyTotals {
  energyKcal: number;
  proteinGram: number;
  fatGram: number;
  carbGram: number;
  fiberGram: number;
  calciumMg: number;
  ironMg: number;
  vitaminA: number;
  vitaminC: number;
}

export interface FoodIntakeDailySummary {
  childId: string;
  date: string; // YYYY-MM-DD
  totalIntakes: number;
  items: FoodIntakeDailySummaryItem[];
  totals: FoodIntakeDailyTotals;
}

export interface ChildDailyNutritionSummary {
  childId: string;
  date: string;
  ageMonths: number;

  who: {
    stuntingStatus: string;
    severity: string;
    zScore: number | null;
    riskLevel: string;
  } | null;

  totals: FoodIntakeDailyTotals;

  target: {
    energyKcal: number;
    baseEnergyKcal: number;
    correctionFactor: number;
    nutritionStatus: NutritionStatus;
    macro: {
      proteinGram: number;
      carbGram: number;
      fatGram: number;
      fiberGram: number;
      source: string;
      referenceAgeMonths: number;
    };
  };

  progress: {
    energyPercent: number;
    status: 'GOOD' | 'ENOUGH' | 'LOW';
  };
}
