
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

// Debug utility for development - Check Supabase edge function connectivity
if (import.meta.env.DEV) {
  const testEdgeFunction = async () => {
    try {
      console.log("Testing Supabase Edge Function connectivity...");
      const { data, error } = await supabase.functions.invoke('ad-account-test', {
        body: { platform: 'test' },
      });
      
      if (error) {
        console.error("Edge function connectivity test failed:", error);
      } else {
        console.log("Edge function connectivity test result:", data);
      }
    } catch (e) {
      console.error("Edge function connectivity test exception:", e);
    }
  };
  
  // Automatically run the test on development
  testEdgeFunction();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
