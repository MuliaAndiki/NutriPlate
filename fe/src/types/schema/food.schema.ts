import { IFoodIntakeItem } from "./foodIntakeItem.schema";
export interface IFood {
  id: string;
  childId: string;
  iotId?: string;
  photoUrl?: string;
  createdAt: string;
  inferenceHash?: string;
  mlModelVersion?: string;
  totalWeightGram: number;
  updatedAt: string;
}

export interface IFoodWithItems extends IFood {
  items?: IFoodIntakeItem[];
  iot?: any;
}
