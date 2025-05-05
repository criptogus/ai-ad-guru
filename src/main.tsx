
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { CreditsProvider } from "@/contexts/CreditsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { HelmetProvider } from 'react-helmet-async';
import { Router } from './router';
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="theme-preference">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CreditsProvider>
              <CampaignProvider>
                <LanguageProvider>
                  <Router />
                  <Toaster position="top-center" richColors />
                </LanguageProvider>
              </CampaignProvider>
            </CreditsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
)
