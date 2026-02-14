export interface IFood {
  id: string;
  childID: string;
  iotId: string;
  photoUrl: string;
  createdAt: string;
  inferenceHash: string;
  mlModelVersion: string;
  totalWeightGram: number;
  updatedAt: string;
}

export interface FoodHistoryQuery {
  page?: string;
  limit?: string;
  childId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
export type PickFoodID = Pick<IFood, 'id'>;
