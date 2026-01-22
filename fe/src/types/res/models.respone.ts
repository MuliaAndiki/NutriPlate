export interface MlModelResponse {
  id: string;
  name: string;
  version: string;
  modelPath: string;
  metrics?: any;
  isActive: boolean;
  createdAt: Date;
}

export interface PostModelsVersionResponse {
  status: number;
  message: string;
  data: MlModelResponse;
}

export interface GetModelsResponse {
  status: number;
  message: string;
  data: MlModelResponse[];
}
