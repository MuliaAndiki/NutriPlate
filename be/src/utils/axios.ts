import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '@/config/env.config';

export function AxiosService() {
  const AxiosHit: AxiosInstance = axios.create({
    baseURL: env.SERVICE_APP,
    timeout: 50000,
  });

  return {
    AxiosHit,
    isAxiosError: axios.isAxiosError,
  };
}
