import axios, { AxiosInstance } from 'axios';
import { env } from '@/config/env.config';
import { pingHost } from './ping';

let cachedScaleURL: string | null = null;

function log(title: string, message?: any) {
  const time = new Date().toLocaleTimeString();
  console.log(
    `%c[IoT ${time}] %c${title}`,
    'color:#00bcd4;font-weight:bold',
    'color:#4caf50;font-weight:bold',
    message ?? '',
  );
}

export function AxiosService() {
  const hostname = 'nutriplate.local';

  const scaleURLs = [
    `http://${hostname}`,
    env.SCALE_BASE_URL,
    'http://192.168.1.100',
    'http://192.168.0.100',
    'http://10.0.0.100',
    'http://192.168.18.100',
  ].filter(Boolean);

  const IotHit: AxiosInstance = axios.create({
    timeout: 10000,
  });

  async function warmupScale(url: string) {
    try {
      await axios.get(`${url}/api/status`, { timeout: 2000 });
    } catch {}
  }

  IotHit.interceptors.request.use(async (config) => {
    // 🔥 WAKE UP mDNS + ARP
    await pingHost(hostname);

    // pakai cache kalau sudah ketemu
    if (cachedScaleURL) {
      config.baseURL = cachedScaleURL;
      return config;
    }

    // discovery loop
    for (const url of scaleURLs) {
      try {
        await warmupScale(url);

        await axios.get(`${url}/api/status`, { timeout: 2000 });

        cachedScaleURL = url;
        config.baseURL = url;

        console.log('✅ Scale discovered at:', url);
        return config;
      } catch {}
    }

    throw new Error('Scale tidak ditemukan. Pastikan device hidup & satu jaringan.');
  });

  // reset cache kalau request gagal (device reboot / pindah wifi)
  IotHit.interceptors.response.use(
    (res) => res,
    () => {
      cachedScaleURL = null;
      return Promise.reject();
    },
  );

  const MlHit: AxiosInstance = axios.create({
    baseURL: env.ML_APP,
    timeout: 50000,
  });

  async function discoverScale() {
    await pingHost(hostname);

    for (const url of scaleURLs) {
      try {
        await warmupScale(url);

        const res = await axios.get(`${url}/api/status`, { timeout: 3000 });

        cachedScaleURL = url;

        return {
          url,
          ip: res.data?.ip || 'unknown',
          deviceInfo: res.data,
        };
      } catch {}
    }

    throw new Error('Scale tidak ditemukan di jaringan.');
  }

  async function getCurrentIP(): Promise<string> {
    try {
      const res = await IotHit.get('/api/status');
      return res.data?.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  return {
    MlHit,
    IotHit,
    discoverScale,
    getCurrentIP,
    isAxiosError: axios.isAxiosError,
  };
}
