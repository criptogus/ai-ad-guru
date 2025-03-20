
import React from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Clock, Rocket } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const RoadmapPage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Product Roadmap | Zero Digital Agency</title>
        <html lang={currentLanguage} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Zero Digital Agency SaaS Roadmap</h1>
            <p className="text-lg text-center mb-12">
              Our vision is to build the most advanced AI-powered ad management platform, 
              making digital advertising simpler, smarter, and more profitable. Below is our 
              product roadmap, outlining the key milestones for the upcoming months.
            </p>

            {/* Phase 1 */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-100 text-brand-700 p-2 rounded-full">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Phase 1 – Core Platform Development (MVP) ✅ [In Progress]</h2>
              </div>
              <div className="border-l-2 border-brand-200 pl-8 ml-4 space-y-3">
                <p className="text-lg">🔹 Multi-Platform Ad Management (Google, Meta, LinkedIn, Microsoft)</p>
                <p className="text-lg">🔹 AI-Generated Ad Copy & Creatives (DALL·E for images, GPT for text)</p>
                <p className="text-lg">🔹 Ad Performance Dashboard (Real-time analytics + AI insights)</p>
                <p className="text-lg">🔹 Subscription & Billing System (Stripe integration)</p>
                <p className="text-lg">🔹 AI Credit System (Users purchase credits for ad creation)</p>
                <p className="text-lg">🔹 Basic Campaign Automation (Pause low-performing ads, optimize budgets)</p>
                <p className="text-lg">🔹 OAuth Integration for Ad Platforms (Easy account linking)</p>
                <p className="text-lg">🔹 AI-Generated Campaign Insights (Performance ranking & recommendations)</p>
                <p className="text-lg font-medium mt-4">🛠️ Estimated Completion: Q2 2025</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 text-gray-700 p-2 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Phase 2 – Advanced AI Optimization & A/B Testing</h2>
              </div>
              <div className="border-l-2 border-gray-200 pl-8 ml-4 space-y-3">
                <p className="text-lg">🔹 AI-Driven Budget Allocation (Automatically increase/decrease spend on best ads)</p>
                <p className="text-lg">🔹 Automated A/B Testing (AI generates and tests multiple ad variations)</p>
                <p className="text-lg">🔹 Competitor Benchmarking (AI compares user ads vs. market trends)</p>
                <p className="text-lg">🔹 Ad Fatigue Detection (Identifies underperforming creatives before they lose traction)</p>
                <p className="text-lg">🔹 AI-Powered Audience Targeting (Suggests best audience segments based on performance)</p>
                <p className="text-lg">🔹 LinkedIn & Microsoft Ads Expansion (Deeper AI integration)</p>
                <p className="text-lg">🔹 Automated Ad Scaling (AI suggests higher budgets for top-performing campaigns)</p>
                <p className="text-lg font-medium mt-4">🛠️ Estimated Completion: Q3 2025</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 text-gray-700 p-2 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Phase 3 – AI-Driven Full Funnel Marketing Automation</h2>
              </div>
              <div className="border-l-2 border-gray-200 pl-8 ml-4 space-y-3">
                <p className="text-lg">🔹 Predictive Performance Forecasting (AI estimates future campaign performance)</p>
                <p className="text-lg">🔹 Dynamic Landing Page Creation (AI suggests & builds optimized pages for ads)</p>
                <p className="text-lg">🔹 Omnichannel Ad Expansion (Integrations with TikTok, Pinterest, Twitter Ads)</p>
                <p className="text-lg">🔹 AI-Powered CRM Integration (Sync ad performance with HubSpot, Salesforce, etc.)</p>
                <p className="text-lg">🔹 Automated Retargeting & Lookalike Audiences (AI improves remarketing strategies)</p>
                <p className="text-lg">🔹 Voice & Video Ads (AI generates optimized ad scripts for YouTube & TikTok)</p>
                <p className="text-lg">🔹 Custom AI Chatbot for Advertisers (Real-time AI assistant for campaign advice)</p>
                <p className="text-lg font-medium mt-4">🛠️ Estimated Completion: Q4 2025 - Q1 2026</p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 text-gray-700 p-2 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Phase 4 – AI as a Digital CMO</h2>
              </div>
              <div className="border-l-2 border-gray-200 pl-8 ml-4 space-y-3">
                <p className="text-lg">🔹 Autonomous Campaign Execution (AI fully manages campaigns end-to-end)</p>
                <p className="text-lg">🔹 Cross-Channel AI Attribution (Tracks how ads influence conversions across platforms)</p>
                <p className="text-lg">🔹 Multi-Language AI Copywriting (Ads generated in multiple languages for global campaigns)</p>
                <p className="text-lg">🔹 Real-Time AI Market Trends & Insights (Detects and reacts to market trends automatically)</p>
                <p className="text-lg">🔹 Agency & White-Label Solutions (Enable agencies to use the platform with custom branding)</p>
                <p className="text-lg">🔹 Custom AI Branding & Creative Strategy (AI generates full brand campaigns, not just ads)</p>
                <p className="text-lg font-medium mt-4">🛠️ Estimated Completion: Q2-Q4 2026</p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-brand-50 border border-brand-100 rounded-lg p-8 mb-10">
              <h3 className="text-2xl font-bold mb-4">📢 Our Mission</h3>
              <p className="text-lg mb-6">
                We're building the future of AI-powered digital advertising—where businesses can launch, 
                optimize, and scale ads effortlessly while AI takes care of the heavy lifting.
              </p>
              <div className="flex items-center gap-2 font-medium text-lg">
                <Rocket className="text-brand-600" />
                <p>Want to be part of this journey? Join us now and transform your advertising with AI!</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RoadmapPage;
