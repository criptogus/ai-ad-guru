
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider } from './contexts/AuthContext';

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
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
