import type { Metadata, Viewport } from "next";

export const siteConfig = {
  name: "NutriPlate",
  description:
    "Sistem Integratif Berbasis IoT & PWA untuk Pemantauan Gizi Anak di Dusun Lambateung",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://nutriplate.vercel.app",
  locale: "id-ID",
  keywords: [
    "nutrisi",
    "gizi",
    "anak",
    "stunting",
    "pemantauan",
    "pwa",
    "aplikasi",
    "indonesia",
  ],
  themeColor: "#10B981",
  backgroundColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/favicon-96x96.svg",
        sizes: "96x96",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/logo.svg",
        color: siteConfig.themeColor,
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/logo.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/logo.svg"],
  },
  other: {
    "google-site-verification":
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    "msvalidate.01": process.env.NEXT_PUBLIC_MS_VALIDATION || "",
    "msapplication-TileColor": siteConfig.themeColor,
    "msapplication-config": "/favicon/browserconfig.xml",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
    startupImage: [
      {
        url: "/favicon/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px)",
      },
      {
        url: "/favicon/apple-splash-1668-2224.png",
        media: "(device-width: 834px) and (device-height: 1194px)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: siteConfig.themeColor,
};
