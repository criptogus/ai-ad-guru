
// Set environment variables before anything else
if (typeof process !== 'undefined') {
  process.env.ROLLUP_NATIVE_DISABLE = '1';
  process.env.DISABLE_NATIVE_MODULES = '1';
}

// Mark native modules as disabled globally
if (typeof globalThis !== 'undefined') {
  // @ts-ignore - Intentional global assignment
  globalThis.__ROLLUP_NATIVE_DISABLED__ = true;
}

console.log("[Application] Environment variables set, initializing application");

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";

// Debug main execution with more detailed logging
console.log("[Application] Main script executing - initializing application");
console.log("[Application] Environment:", import.meta.env.MODE);
console.log("[Application] React version:", React.version);

// Create a client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      // Use meta for error handling (compatible with latest Tanstack Query)
      meta: {
        onError: (error: Error) => {
          console.error("[QueryClient] Query error:", error);
        }
      }
    },
  },
});

// Mount React application with all providers
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[Application] Root element not found! Cannot mount React application.");
} else {
  console.log("[Application] Mounting React application to DOM");
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </LanguageProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  console.log("[Application] React application mounted successfully");
}
