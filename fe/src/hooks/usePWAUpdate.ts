import { useEffect, useRef, useState } from "react";

export function usePWAUpdate(onUpdateAvailable?: () => void) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateRegistration, setUpdateRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[PWA] Dev mode: Service Worker disabled");
      return;
    }

    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator)) {
      console.warn("[PWA] Service Worker tidak didukung di browser ini");
      return;
    }

    let refreshing = false;

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      console.log("[PWA] Service Worker updated, reloading...");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .then((registration) => {
        registrationRef.current = registration;
        setUpdateRegistration(registration);
        console.log("[PWA] Service Worker registered:", registration);

        // Detect when new service worker is waiting
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          console.log("[PWA] New service worker installing...");

          newWorker.onstatechange = () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("[PWA] Update available!");
              setUpdateAvailable(true);
              onUpdateAvailable?.();
            }
          };
        };

        // Check for waiting service worker
        if (registration.waiting) {
          console.log("[PWA] Waiting service worker found");
          setUpdateAvailable(true);
          onUpdateAvailable?.();
        }

        // Check for updates every hour
        const updateCheckInterval = setInterval(
          () => {
            registration.update().catch((err) => {
              console.error("[PWA] Error checking for updates:", err);
            });
          },
          60 * 60 * 1000,
        );

        return () => clearInterval(updateCheckInterval);
      })
      .catch((err) => {
        console.error("[PWA] Service Worker registration failed:", err);
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, [onUpdateAvailable]);

  /**
   * Trigger skip waiting & reload
   */
  const updateApp = async () => {
    if (!updateRegistration?.waiting) {
      console.warn("[PWA] No waiting service worker found");
      return;
    }

    console.log("[PWA] Triggering SKIP_WAITING...");
    updateRegistration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Listen for controller change
    const handleControllerChange = () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      console.log("[PWA] Service worker updated, reloading page...");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      window.location.reload();
    }, 3000);
  };

  const skipUpdate = () => {
    setUpdateAvailable(false);
    console.log("[PWA] Update skipped by user");
  };

  return {
    updateAvailable,
    updateApp,
    skipUpdate,
    registration: updateRegistration,
  };
}
