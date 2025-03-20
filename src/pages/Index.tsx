
import React, { useEffect } from "react";
import LandingPage from "./LandingPage";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { applySecurityHeaders, securityAudit } from "@/middleware/securityMiddleware";
import { getSecurityHeaders } from "@/config/security";

const Index = () => {
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    // Apply security headers at component mount
    applySecurityHeaders();
    
    // Schedule regular security audits on app start
    securityAudit.scheduleRegularAudits();
    
    // This effect should only run once on initial render
  }, []);
  
  // Get all security headers for Helmet
  const securityHeaders = getSecurityHeaders();
  
  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        {/* Apply CSP and security headers via Helmet */}
        {Object.entries(securityHeaders).map(([name, content]) => (
          <meta key={name} httpEquiv={name} content={content as string} />
        ))}
        {/* Additional security headers that might not be in our config */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </Helmet>
      <LandingPage />
    </>
  );
};

export default Index;
