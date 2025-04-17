
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Process } from '@/components/landing/Process';
import { Trust } from '@/components/landing/Trust';
import { Pricing } from '@/components/landing/Pricing';
import { Cta } from '@/components/landing/Cta';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const Index: React.FC = () => {
  useAuthRedirect({ redirectAuthenticated: true, redirectPath: '/dashboard' });
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI-Powered Ad Manager | Create & Optimize High-Converting Ads</title>
        <meta 
          name="description" 
          content="Generate, optimize, and manage your Google & Meta ads with AI. Get 5X better ROAS with automated ad creation and optimization across platforms." 
        />
      </Helmet>
      
      <AuthProvider>
        <Nav />
      </AuthProvider>
      
      <main>
        <Hero 
          title="Create High-Converting Ads with AI" 
          subtitle="Generate, test, and optimize Google & Meta ads automatically. Get 5X better ROAS with AI-powered ad creation and management."
          primaryAction="/auth/register"
          primaryActionText="Start Free Trial"
          secondaryAction="/pricing"
          secondaryActionText="View Pricing"
        />
        
        <Features />
        <Process />
        <Trust />
        <Pricing />
        
        <Cta 
          title="Ready to transform your ad campaigns?"
          subtitle="Join hundreds of businesses saving time and money with AI-powered ad optimization."
          primaryAction="/auth/register"
          primaryActionText="Start Free Trial"
          secondaryAction="/pricing" 
          secondaryActionText="View Pricing"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
