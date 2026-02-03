import axios, { AxiosInstance } from 'axios';
import { env } from '@/config/env.config';

export function AxiosService() {
  const scaleURLs = [
    env.SCALE_BASE_URL,
    'http://192.168.1.100',
    'http://192.168.0.100',
    'http://10.0.0.100',
    'http://192.168.18.100',
  ];

  // Smart scale instance
  const IotHit: AxiosInstance = axios.create({
    timeout: 30000,
  });

  IotHit.interceptors.request.use(async (config) => {
    if (!config.baseURL) {
      for (const url of scaleURLs) {
        try {
          await axios.get(`${url}/api/status`, { timeout: 2000 });
          config.baseURL = url;
          console.log(` Scale found at: ${url}`);
          break;
        } catch (error) {}
      }

      if (!config.baseURL) {
        throw new Error(
          'Scale not found. Please ensure: 1) Scale is powered on 2) Connected to WiFi 3) Try again',
        );
      }
    }
    return config;
  });

  const MlHit: AxiosInstance = axios.create({
    baseURL: env.ML_APP,
    timeout: 50000,
  });

  async function discoverScale(): Promise<{
    url: string;
    ip: string;
    deviceInfo: any;
  }> {
    console.log('🔍 Looking for scale...');

    for (const url of scaleURLs) {
      try {
        const response = await axios.get(`${url}/api/status`, { timeout: 3000 });
        const ip = response.data.ip || extractIPFromURL(url);

        console.log(` Scale found: ${url} (IP: ${ip})`);

        return {
          url,
          ip,
          deviceInfo: response.data,
        };
      } catch (error) {
        console.log(`❌ Not at: ${url}`);
      }
    }

    throw new Error(`
      Scale not found! Check:
      1.  Scale is powered ON
      2.  Connected to WiFi
      3.  Try restarting scale
      4. s Make sure you're on the same WiFi network
      
      Tried locations: ${scaleURLs.join(', ')}
    `);
  }

  async function getCurrentIP(): Promise<string> {
    try {
      const response = await IotHit.get('/api/status');
      return response.data.ip || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  function extractIPFromURL(url: string): string {
    const match = url.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    return match ? match[0] : 'unknown';
  }

  return {
    MlHit,
    IotHit,
    discoverScale,
    getCurrentIP,
    isAxiosError: axios.isAxiosError,
  };
}
