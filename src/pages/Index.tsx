
import React, { useEffect } from "react";
import LandingPage from "./LandingPage";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    // Enhanced debug logging
    console.log("Index component mounted");
    console.log("Current language:", currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <title>AI Ad Guru | Create High-Converting Ads with AI</title>
        <meta name="description" content="Generate, optimize, and manage your Google, Meta, LinkedIn & Microsoft ads with the power of AI. Less effort, better results." />
      </Helmet>
      <LandingPage />
    </>
  );
};

export default Index;
