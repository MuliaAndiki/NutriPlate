"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AOS from "aos";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { env } from "@/configs/env.config";
import { AuthProvider } from "@/core/providers/auth.provider";
import { ThemeProvider } from "@/core/providers/theme.provider";
import { AlertProvinder } from "@/hooks/useAlert/costum-alert";
import { ReactQueryClientProvider } from "@/pkg/react-query/query-client.pkg";
import { persistor, store } from "@/stores/store";
import { composeProviders } from "./composeProvinders";
import { SocketProvider } from "@/core/providers/socket.provinder";
import { ClientGate } from "@/core/providers/client-gate";

const Providers = composeProviders([
  ({ children }) => (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  ),
  ({ children }) => <Provider store={store}>{children}</Provider>,
  ({ children }) => <PersistGate persistor={persistor}>{children}</PersistGate>,

  AuthProvider,
  SocketProvider,
  ThemeProvider,
  AlertProvinder,
  ReactQueryClientProvider,
  ClientGate,

  ({ children }) => (
    <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
  ),
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Providers>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-center" toastOptions={{ duration: 900 }} />
    </Providers>
  );
}
