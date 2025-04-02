
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

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI-Powered Ad Manager | Zero Digital Agency</title>
        <meta name="description" content="Automate your Google Ads & Meta Ads campaigns with AI-powered optimization. Create, manage, and optimize ads that convert better with less effort." />
      </Helmet>
      
      <AuthProvider>
        <Nav />
      </AuthProvider>
      
      <main>
        <Hero 
          title="AI-Powered Ad Management" 
          subtitle="Create, optimize, and scale your ad campaigns with intelligent automation"
          primaryAction="/auth/register"
          primaryActionText="Get Started"
          secondaryAction="/pricing"
          secondaryActionText="See Pricing"
        />
        
        <Features />
        
        <Process />
        
        <Trust />
        
        <Pricing />
        
        <Cta 
          title="Ready to transform your advertising strategy?"
          subtitle="Join thousands of businesses saving time and money with AI-powered ad optimization."
          primaryAction="/auth/register"
          primaryActionText="Start for free"
          secondaryAction="/pricing" 
          secondaryActionText="View pricing"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
