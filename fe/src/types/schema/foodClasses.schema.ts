export interface IFoodClasses {
  id: string;
  name: string;
  category?: string;
  energyKcal?: number;
  proteinGram?: number;
  fatGram?: number;
  carbGram?: number;
  edibleRatio?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminA?: number;
  vitaminC?: number;
  metadata?: any;
  createdAt: string;
}
