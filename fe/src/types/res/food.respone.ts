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
  pixel?: BoundingBoxPixel;
  normalized?: BoundingBoxNormalized;
  imageSize?: {
    width: number;
    height: number;
  };
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

export interface NutritionTotals extends Nutrition {}

export interface FoodIntakeItem {
  id: string;
  foodClassName: string;
  mlConfidence: number;
  areaRatio: number;
  weightGram: number;
  bboxData?: BoundingBoxData | null;
  metadata?: {
    formula?: string;
    boundingBox?: BoundingBox;
    modelVersion?: string;
    hasBoundingBox?: boolean;
    nutrientSource?: string;
    validationPassed?: boolean;
    areaRatioValidated?: boolean;
    inferenceThreshold?: number;
  } | null;

  energyKcal?: number | null;
  proteinGram?: number | null;
  fatGram?: number | null;
  carbGram?: number | null;
  fiberGram?: number | null;
  calciumMg?: number | null;
  ironMg?: number | null;
  vitaminA?: number | null;
  vitaminC?: number | null;

  createdAt: string | Date;
}

export interface FoodDetection {
  foodClassName: string;
  confidence: number;
  areaRatio: number;
  boundingBox: BoundingBox;
  nutrition: Nutrition;
}

export interface FoodIntakeResponse {
  id: string;
  childId: string;
  iotId?: string | null;
  photoUrl?: string | null;
  title: string;
  totalWeightGram: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  totals: NutritionTotals;
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
