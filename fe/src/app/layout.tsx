import { metadata, siteConfig } from "./metadata";
import "@/styles/globals.css";
import { AppProviders } from "./providers";
import "aos/dist/aos.css";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
