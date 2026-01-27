export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BoundingBoxNormalized {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoundingBoxPixel {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface BoundingBoxData {
  normalized?: BoundingBoxNormalized;
  pixel?: BoundingBoxPixel;
  imageSize?: {
    width: number;
    height: number;
  };
}

export interface FoodIntakeItem {
  id: string;
  foodClassName: string;
  mlConfidence: number;
  areaRatio: number;
  weightGram: number;
  bboxData?: BoundingBoxData | null;
  metadata?: any | null;
  energyKcal?: number | null;
  proteinGram?: number | null;
  fatGram?: number | null;
  carbGram?: number | null;
  fiberGram?: number | null;
  calciumMg?: number | null;
  ironMg?: number | null;
  vitaminA?: number | null;
  vitaminC?: number | null;
  createdAt: Date;
}

export interface NutritionTotals {
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

export interface Nutrition {
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

export interface FoodDetection {
  foodClassName: string;
  confidence: number;
  areaRatio: number;
  boundingBox: BoundingBox;
  nutrition: Nutrition;
}

export interface AnalyzeImageResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    detections: FoodDetection[];
    metadata: {
      modelVersion: string;
      threshold: number;
      detectionCount: number;
      processingTime: string;
      inferenceHash: string;
    };
  };
}

/**
 * Food Intake with summary (totals) and detailed items
 * Perfect for displaying both overview and detailed nutrition information
 */
export interface FoodIntakeResponse {
  id: string;
  childId: string;
  iotId?: string | null;
  photoUrl?: string | null;
  title: string;
  totalWeightGram: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Summary totals from all items combined
  totals: NutritionTotals;
  // Detailed items for individual inspection
  items: FoodIntakeItem[];
}

export interface CreateFoodIntakeResponse {
  status: number;
  message: string;
  data: FoodIntakeResponse & {
    processingMetadata?: {
      modelVersion: string;
      threshold: number;
      areaRatioTolerance: number;
      detectionCount: number;
      areaRatioSum: string;
      processingTime: string;
      inferenceHash: string;
      inferenceSource: string;
      validationStatus: string;
      imageSource: string;
    };
  };
}

export interface GetFoodHistoryResponse {
  status: number;
  message: string;
  data: {
    items: FoodIntakeResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface GetFoodHistoryByIDResponse {
  status: number;
  message: string;
  data: FoodIntakeResponse;
}
