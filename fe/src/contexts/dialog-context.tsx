"use client";

import { createContext, useContext, useMemo, useState } from "react";

type DialogType = "pwa-install";

interface DialogContextValue {
  dialog: DialogType | null;
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogType | null>(null);

  const value = useMemo(
    () => ({
      dialog,
      openDialog: (type: DialogType) => setDialog(type),
      closeDialog: () => setDialog(null),
    }),
    [dialog],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
