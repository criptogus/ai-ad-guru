
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
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AI Ad Guru | Create High-Converting Ads with Artificial Intelligence</title>
        <meta name="description" content="Generate, optimize, and manage your Google and Meta ads with the power of GPT-4 and DALL-E 3. Less effort, better results." />
        <meta name="keywords" content="AI ads, ad generation, marketing automation, Google ads, Meta ads, Facebook ads, GPT-4, DALL-E" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="AI Ad Guru | Create High-Converting Ads with Artificial Intelligence" />
        <meta property="og:description" content="Generate, optimize, and manage your Google and Meta ads with the power of GPT-4 and DALL-E 3. Less effort, better results." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="AI Ad Guru | Create High-Converting Ads with Artificial Intelligence" />
        <meta property="twitter:description" content="Generate, optimize, and manage your Google and Meta ads with the power of GPT-4 and DALL-E 3. Less effort, better results." />
        <meta property="twitter:image" content="/og-image.png" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
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
