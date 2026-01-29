import type { Metadata } from "next";

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
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logo.svg", type: "image/svg" },
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
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
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
    "theme-color": siteConfig.themeColor,
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteConfig.name,
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
};
