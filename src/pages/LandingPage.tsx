
import React from "react";
import { Helmet } from "react-helmet-async";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";
import { LoginButton } from "@/components/landing/LoginButton";

const LandingPage: React.FC = () => {
  // Current URL for canonical and OG tags
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://aiadguru.com';
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AI Ad Guru | Create High-Converting Ads with AI for Google, Meta, LinkedIn & Microsoft</title>
        <meta name="description" content="Generate, optimize and manage Google, Meta, LinkedIn & Microsoft ads that actually convert using GPT-4 and DALL·E 3. Save time, increase ROAS and grow your business." />
        <meta name="keywords" content="AI ads, Google ads generator, Meta ads creator, LinkedIn ads, Microsoft ads, ad automation, marketing AI, GPT-4 ads, DALL·E ads, Instagram ads, ad optimization, ROI optimization" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content="AI Ad Guru | Create High-Converting Ads with AI for Google, Meta, LinkedIn & Microsoft" />
        <meta property="og:description" content="Generate, optimize and manage ads across major platforms that actually convert using GPT-4 and DALL·E 3. Save time, increase ROAS and grow your business." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content="AI Ad Guru | Create High-Converting Ads with AI for Google, Meta, LinkedIn & Microsoft" />
        <meta property="twitter:description" content="Generate, optimize and manage ads across major platforms that actually convert using GPT-4 and DALL·E 3. Save time, increase ROAS and grow your business." />
        <meta property="twitter:image" content="/og-image.png" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Ad Guru",
            "applicationCategory": "MarketingApplication",
            "offers": {
              "@type": "Offer",
              "price": "99",
              "priceCurrency": "USD"
            },
            "description": "AI-powered ad creation and optimization for Google, Meta, LinkedIn, and Microsoft platforms.",
            "operatingSystem": "Web browser",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127"
            }
          })}
        </script>
      </Helmet>
      <Nav />
      <Hero />
      <LoginButton />
      <Features />
      <Process />
      <Pricing />
      <Trust />
      <Cta />
      <Footer />
    </div>
  );
};

export default LandingPage;
