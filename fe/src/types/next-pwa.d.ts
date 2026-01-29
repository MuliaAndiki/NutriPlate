declare module "next-pwa" {
  import type { NextConfig } from "next";

  type RuntimeCaching = {
    urlPattern: RegExp | string;
    handler:
      | "CacheFirst"
      | "NetworkFirst"
      | "StaleWhileRevalidate"
      | "NetworkOnly"
      | "CacheOnly";
    method?: "GET" | "POST";
    options?: {
      cacheName?: string;

      networkTimeoutSeconds?: number;

      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };

      cacheableResponse?: {
        statuses?: number[];
      };

      backgroundSync?: {
        name: string;
        options?: {
          maxRetentionTime?: number;
        };
      };
    };
  };

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    disable?: boolean;
    reloadOnOnline?: boolean;

    runtimeCaching?: RuntimeCaching[];
    buildExcludes?: (string | RegExp)[];
    publicExcludes?: (string | RegExp)[];
    scope?: string;
    sw?: string;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
  }

  const withPWA: (
    pwaConfig: PWAConfig,
  ) => (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
