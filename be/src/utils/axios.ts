import axios, { AxiosInstance } from 'axios';
import { env } from '@/config/env.config';

export function AxiosService() {
  const baseURL = env.VPS_URL ?? env.SCALE_BASE_URL;
  if (!baseURL) {
    throw new Error('VPS_URL or SCALE_BASE_URL must be set.');
  }

  const IotHit: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
  });

  const MlHit: AxiosInstance = axios.create({
    baseURL: env.ML_APP,
    timeout: 50000,
  });

  return {
    MlHit,
    IotHit,
    isAxiosError: axios.isAxiosError,
  };
}
