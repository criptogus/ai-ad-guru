
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
import { useLanguage } from '@/contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI-Powered Ad Manager | Automated Advertising Optimization</title>
        <meta name="description" content="Automate your Google Ads & Meta Ads campaigns with AI-powered optimization. Create, manage, and optimize ads that convert better with less effort." />
      </Helmet>
      
      <Nav />
      
      <main>
        <Hero 
          title={t("ai_powered_ad_management")}
          subtitle={t("create_optimize_scale")} 
          primaryAction="/auth/register"
          primaryActionText={t("get_started")}
          secondaryAction="/pricing"
          secondaryActionText={t("see_pricing")}
        />
        
        <Features />
        <Process />
        <Trust />
        <Pricing />
        
        <Cta 
          title={t("ready_to_transform")}
          subtitle={t("join_thousands")}
          primaryAction="/auth/register"
          primaryActionText={t("start_for_free")}
          secondaryAction="/pricing" 
          secondaryActionText={t("view_pricing")}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
