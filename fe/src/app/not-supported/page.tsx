"use client";

/**
 * Not Supported Page
 *
 * Halaman ini hanya ditampilkan jika:
 * 1. Somehow non-mobile device bypass proxy.ts middleware (edge case)
 * 2. User resize dari mobile ke desktop (rare, tapi handle jadi aman)
 *
 * Proxy.ts sudah handle 95% case, ini hanya fallback security
 */

export default function NotSupportedPage() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 w-full px-4">
      <h1 className="text-2xl font-bold text-center">📱 Mobile Only</h1>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        NutriPlate hanya tersedia untuk perangkat mobile.
        <br />
        <br />
        Silakan buka menggunakan:
        <br />
        ✓ Smartphone / Tablet
        <br />✓ Chrome DevTools mobile mode (F12)
      </p>
    </div>
  );
}
