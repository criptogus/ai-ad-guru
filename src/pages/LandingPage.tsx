
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Ad Guru</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <section className="py-20 bg-background">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Create High-Converting Ads with AI</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate, optimize, and manage your Google, Meta, LinkedIn & Microsoft ads with the power of AI. 
              Less effort, better results.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/login")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/credits-info")}>
                Learn About Credits
              </Button>
            </div>
          </div>
        </section>
        
        {/* Feature Highlights */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Ad Management</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Generated Ad Copy</h3>
                <p className="text-muted-foreground">
                  Create high-converting ad copy for Google, Meta, LinkedIn & Microsoft ads in seconds with our AI.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Optimization</h3>
                <p className="text-muted-foreground">
                  Let AI analyze your ad performance and automatically optimize your campaigns for better results.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">🔄</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
                <p className="text-muted-foreground">
                  Connect your ad accounts with one click and manage everything from a single dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Credit System */}
        <section className="py-20 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Simple Credit-Based System</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Our straightforward credit system gives you flexibility without subscriptions.
              Pay only for what you use.
            </p>
            <Button size="lg" onClick={() => navigate("/credits-info")}>
              View Pricing
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">AI Ad Guru</h2>
              <p className="text-muted-foreground">© 2023 All rights reserved</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
