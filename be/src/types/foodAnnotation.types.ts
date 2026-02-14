export interface IFoodAnnotation {
  id: string;
  rawImageId: string;
  foodClassId: string;
  xCenter: number;
  yCenter: number;
  width: number;
  height: number;
  createdAt: Date;
}
