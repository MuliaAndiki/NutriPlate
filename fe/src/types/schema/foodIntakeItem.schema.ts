export interface IFoodIntakeItem {
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
  createdAt: string;
}
