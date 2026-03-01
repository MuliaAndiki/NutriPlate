import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { PWAInstallDialog } from "@/components/pwa/PWAInstallDialog";
import { appConfig } from "@/configs/app.config";

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid items-start gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={appConfig.logo}
                alt="NutriPlate"
                width={44}
                height={44}
              />
              <h2 className="text-lg font-semibold text-foreground">
                NutriPlate
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Pantau pertumbuhan balita, catat asupan gizi, dan terima
              notifikasi penting dalam satu aplikasi yang mudah digunakan.
            </p>
            <div className="flex items-center gap-3">
              {Object.entries(appConfig.social_media).map(([key, value]) => (
                <Link
                  href={value.url}
                  key={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-secondary text-primary transition hover:bg-primary/10"
                >
                  <Icon icon={value.icon} width={18} height={18} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-start md:justify-end md:gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">Navigasi</p>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                Tentang
              </Link>
              <Link
                href="/policy"
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                Ketentuan Layanan
              </Link>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Download the App
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Scan QR Code untuk menginstall aplikasi melalui Play Store /
                    App Store
                  </p>
                </div>
                <PWAInstallDialog
                  trigger={
                    <button
                      type="button"
                      className="flex h-16 w-16 items-center justify-center rounded-md border border-border bg-card text-[10px] font-semibold text-muted-foreground"
                    >
                      QR
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t border-border bg-foreground/95 py-3">
        <p className="text-center text-xs text-background/80">
          NutriPlate © 2026. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
