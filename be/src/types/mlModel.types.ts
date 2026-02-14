import { MetricsRespone } from '@/partial/profileChild';

export interface IMlModels {
  id: string;
  name: string;
  version: string;
  modelPath: string;
  metrics: MetricsRespone;
  isActive: boolean;
  createdAt: Date;
}
