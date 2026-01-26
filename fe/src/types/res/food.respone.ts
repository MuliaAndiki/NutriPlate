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
