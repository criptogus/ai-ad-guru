
import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, BrainCircuit, Sparkles, LineChart, Target, Zap, Clock, CreditCard, PieChart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Features | AI Ad Guru</title>
        <meta name="description" content="Explore how our AI-powered ad platform uses GPT-4 and DALL-E 3 to create high-converting ads for Google, Meta, LinkedIn, and Microsoft." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-brand-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful AI-Driven Advertising</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI to transform how you create, manage, and optimize ad campaigns across all major platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => window.location.href = '/register'}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = '#platform-features'}>
                Explore Features
              </Button>
            </div>
          </div>
        </section>

        {/* Platform overview */}
        <section className="py-20 px-4" id="platform-features">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-100 text-brand-700 mb-4">
                PLATFORM OVERVIEW
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">One Platform for All Your Ad Needs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Manage campaigns across Google, Meta, LinkedIn, and Microsoft Ads with our powerful AI assistant.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">GPT-4 Powered Copy</h3>
                <p className="text-gray-600">
                  Generate 5 high-converting ad variations that speak directly to your audience's pain points. Costs 5 credits per campaign.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">DALL·E 3 Images</h3>
                <p className="text-gray-600">
                  Create scroll-stopping social media ad visuals for Meta and LinkedIn that drive engagement. Costs 5 credits per image.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">24h Optimization</h3>
                <p className="text-gray-600">
                  AI automatically pauses low performers and reallocates budget to winning ads. Saves 10 credits per optimization.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Audience Targeting</h3>
                <p className="text-gray-600">
                  AI identifies your ideal customer segments for laser-focused targeting across all supported ad platforms.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">One-Click Integration</h3>
                <p className="text-gray-600">
                  Seamlessly connect your Google, Meta, LinkedIn, and Microsoft ad accounts with OAuth for instant campaign publishing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Time-Saving Automation</h3>
                <p className="text-gray-600">
                  Reduce campaign creation time by 90% and improve ROAS with continuous AI optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credit system */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-100 text-brand-700 mb-4">
                CREDIT SYSTEM
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Credits for Every Need</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our credit-based system gives you full control over how you allocate resources to maximize your ROI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Text Ad Generation</h3>
                  <p className="text-gray-600 mb-4">
                    Create 5 Google Ads or Microsoft Ads text variations with powerful AI copywriting.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">5 credits per campaign</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Image Ad Creation</h3>
                  <p className="text-gray-600 mb-4">
                    Generate high-converting image ads for Meta or LinkedIn with DALL·E 3.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">5 credits per image</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <PieChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI Optimization</h3>
                  <p className="text-gray-600 mb-4">
                    Let AI optimize your campaigns at different frequencies to maximize performance.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">10/5/2 credits based on frequency</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" onClick={() => window.location.href = '/pricing'}>
                View Pricing Plans
              </Button>
            </div>
          </div>
        </section>

        {/* AI-driven analytics */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-100 text-brand-700 mb-4">
                ANALYTICS & INSIGHTS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Make Data-Driven Decisions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered analytics provide actionable insights to continually improve your campaigns.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Performance</h3>
                  <p className="text-gray-600">
                    Track CTR, conversions, and budget usage across all your campaigns in real-time with comprehensive dashboards and visualizations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI-Generated Reports</h3>
                  <p className="text-gray-600">
                    Receive detailed insights on how to improve campaigns with automatically generated recommendations and optimization suggestions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-20 px-4 bg-brand-600 text-white">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Ad Campaigns?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Start creating high-converting ads across Google, Meta, LinkedIn, and Microsoft platforms with our AI-powered tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-brand-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/register'}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-brand-700"
                onClick={() => window.location.href = '/pricing'}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
