export interface IFood {
  id: string;
  childID: string;
  iotId: string;
  photo_url: string;
  food_label: string;
  ml_confidence: number;
  weight_gram: number;
  energy_kcal: number;
  protein_gram: number;
  fat_gram: number;
  carb_gram: number;
  vitamins: any;
  nutrition_score: number;
}
