
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
      </Helmet>
      <LandingPage />
    </>
  );
};

export default Index;
