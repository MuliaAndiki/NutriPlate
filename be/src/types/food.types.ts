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

export type PickFoodID = Pick<IFood, 'id'>;
