"use client";

import { useDialogContext } from "@/contexts/dialog-context";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function GlobalDialogRenderer() {
  const { dialog, closeDialog } = useDialogContext();
  const { canInstall, promptInstall, isStandalone } = usePWAInstall();
  const isOpen = dialog === "pwa-install";

  const handleInstall = async () => {
    await promptInstall();
    closeDialog();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <AlertDialogContent className="w-full max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Download NutriPlate
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {isStandalone
              ? "NutriPlate sudah terpasang di perangkat kamu."
              : canInstall
                ? "Pasang NutriPlate sebagai aplikasi agar akses lebih cepat dan nyaman."
                : "Untuk memasang aplikasi, buka menu browser lalu pilih “Add to Home Screen” atau “Install App”."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel asChild>
            <Button variant="outline">Tutup</Button>
          </AlertDialogCancel>
          {canInstall && !isStandalone ? (
            <AlertDialogAction asChild>
              <Button onClick={handleInstall}>Pasang Aplikasi</Button>
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
