import { DatasetStatus } from '@prisma/client';

export interface IFoodRawImage {
  id: string;
  uploader_id: string;
  source_food_id: string;
  image_url: string;
  status: DatasetStatus;
  createdAt: Date;
  labeled_at: Date;
}
