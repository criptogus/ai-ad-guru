
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Nav } from "@/components/landing/Nav";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { Trust } from "@/components/landing/Trust";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Create High-Converting Ads with AI</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate, optimize, and manage your Google, Meta, LinkedIn & Microsoft ads with the power of AI. 
              Less effort, better results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/credits-info")}>
                Learn About Credits
              </Button>
            </div>
          </div>
        </section>
        
        {/* Include all our landing page sections */}
        <Features />
        <Process />
        <Trust />
        <Cta />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
