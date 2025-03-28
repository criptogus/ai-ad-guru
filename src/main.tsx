
// Apply module patches before anything else
import './utils/modulePatches/patchLoader';

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";

// Debug main execution
console.log("Main script executing - initializing application");

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Mount React application with all providers
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found! Cannot mount React application.");
} else {
  console.log("Mounting React application to DOM");
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
  console.log("React application mounted successfully");
}
