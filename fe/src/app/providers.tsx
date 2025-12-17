"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AOS from "aos";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/core/providers/auth.provider";
import { ThemeProvider } from "@/core/providers/theme.provider";
import { AlertProvinder } from "@/hooks/useAlert/costum-alert";
import { ReactQueryClientProvider } from "@/pkg/react-query/query-client.pkg";
import { persistor,store } from "@/stores/store";

import { composeProviders } from "./composeProvinders";

const Providers = composeProviders([
  ({ children }) => (
    <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
  ),
  ({ children }) => <Provider store={store}>{children}</Provider>,
  ({ children }) => <PersistGate persistor={persistor}>{children}</PersistGate>,
  AuthProvider,
  ThemeProvider,
  AlertProvinder,
  ReactQueryClientProvider,
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 900,
        }}
      />
    </Providers>
  );
}
