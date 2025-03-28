
import React, { useEffect } from "react";
import LandingPage from "./LandingPage";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    // Debug log to verify the component is mounting
    console.log("Index component mounted");
  }, []);

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
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
