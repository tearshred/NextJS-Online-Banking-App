"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider } from "react-redux";
import { useDispatch } from 'react-redux';
import store, { AppDispatch } from "./store/store";
import { checkAuthStatus } from './actions/auth/authStatus';

// Separate AuthStateHandler to manage authentication state
function AuthStateHandler({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    // Only run in browser environment (not during SSR)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token validity on app load
        dispatch(checkAuthStatus());
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <AuthStateHandler>
            {children}
          </AuthStateHandler>
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  );
}
