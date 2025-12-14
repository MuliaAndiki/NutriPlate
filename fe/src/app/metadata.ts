import type { Metadata } from "next";

export const siteConfig = {
  name: "NutriPlate",
  description: "Aplikasi berbasis Next.js dengan UI yang modern",
  url: "https://your-domain.com",
  locale: "id-ID",
  keywords: [
    "next.js",
    "react",
    "aplikasi web",
    "indonesia",
    "modern ui",
    "shadcn",
  ],
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
      { url: "/images/logo.svg", type: "image/svg" },
      { url: "/favicon/favicon.ico" },
    ],
    shortcut: "/images/logo.svg",
    apple: [
      { url: "/images/logo.svg", type: "image/svg" },
      { url: "/images/logo.svg", sizes: "180x180", type: "image/svg" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/logo.svg",
        color: "#000000",
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
    "google-site-verification": "your-verification-code",
    "msvalidate.01": "your-verification-code",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
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
    title: siteConfig.name,
    statusBarStyle: "black",
    capable: true,
  },
};
