"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <ToastProvider>
          <SessionProvider>
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {children}
          </SessionProvider>
        </ToastProvider>
      </Provider>
    </NextThemesProvider>
  );
}
