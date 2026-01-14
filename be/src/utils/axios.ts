import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '@/config/env.config';

export function AxiosService() {
  const MlHit: AxiosInstance = axios.create({
    baseURL: env.ML_APP,
    timeout: 50000,
  });

  const IotHit: AxiosInstance = axios.create({
    baseURL: env.IOT_APP,
  });

  return {
    MlHit,
    IotHit,
    isAxiosError: axios.isAxiosError,
  };
}
