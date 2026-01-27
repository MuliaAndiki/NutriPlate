export interface FoodIntakeItem {
  id: string;
  foodIntakeId: string;
  foodClassName: string;
  mlConfidence: number;
  areaRatio: number;
  weightGram: number;
  energyKcal?: number;
  proteinGram?: number;
  fatGram?: number;
  carbGram?: number;
  fiberGram?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminA?: number;
  vitaminC?: number;
  metadata?: any;
  createdAt: Date;
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
  boundingBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
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

export interface FoodIntakeResponse {
  id: string;
  childId: string;
  iotId?: string;
  photoUrl?: string;
  inferenceHash?: string;
  mlModelVersion?: string;
  totalWeightGram: number;
  createdAt: string;
  updatedAt: Date;
  title: string;
  items: FoodIntakeItem;
}

export interface CreateFoodIntakeResponse {
  status: number;
  message: string;
  data: FoodIntakeResponse;
}

export interface GetFoodHistoryResponse {
  status: number;
  message: string;
  data: FoodIntakeResponse[];
}

export interface GetFoodHistoryByIDResponse {
  status: number;
  message: string;
  data: FoodIntakeResponse;
}
