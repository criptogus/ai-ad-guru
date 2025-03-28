
import React from "react";
import LandingPage from "./LandingPage";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <title>AI Ad Guru | Create High-Converting Ads with AI</title>
      </Helmet>
      <LandingPage />
    </>
  );
};

export default Index;
