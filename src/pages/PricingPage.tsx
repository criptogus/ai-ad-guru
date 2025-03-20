
import React from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle, CreditCard, AlertCircle, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { Link } from "react-router-dom";

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing | AI Ad Guru</title>
        <meta name="description" content="Simple, transparent pricing for AI Ad Guru. Choose the plan that best suits your advertising needs across Google, Meta, LinkedIn and Microsoft." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-brand-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that best fits your advertising needs with our credit-based system.
            </p>
          </div>
        </section>

        {/* Main pricing card */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="max-w-lg mx-auto mb-16">
              <Card className="overflow-hidden border-2 border-brand-200 shadow-lg">
                <CardHeader className="p-8 text-center bg-gradient-to-r from-brand-600 to-brand-700 text-white">
                  <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                  <div className="flex items-center justify-center">
                    <span className="text-5xl font-bold">$99</span>
                    <span className="text-xl ml-2">/month</span>
                  </div>
                  <p className="mt-3 text-brand-100">
                    Perfect for businesses looking to optimize their ad spend
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span><strong>400 credits</strong> per month (renews monthly)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span>Access to <strong>all ad platforms</strong>: Google, Meta, LinkedIn, Microsoft</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span><strong>GPT-4 powered</strong> ad copy generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span><strong>DALL·E 3</strong> image creation for social ads</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span>24-hour <strong>automated optimization</strong></span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span><strong>10%</strong> of ad spend fee via Stripe</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full text-lg py-6"
                    onClick={() => window.location.href = '/register'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Credit breakdown */}
            <div className="bg-gray-50 rounded-xl p-8 mb-16">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold mb-3">Credit Usage Breakdown</h3>
                <p className="text-gray-600">
                  Understand exactly how your credits are spent when using our platform
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold">Google & Microsoft Ads</h4>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Generate 5 text ad variations optimized for search results.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">5 credits</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold">Meta & LinkedIn Ads</h4>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Create 1 image + caption for social media platforms.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">5 credits</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold">AI Optimization</h4>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Automatic optimization based on selected frequency.
                  </p>
                  <div className="bg-brand-50 p-3 rounded-md text-center">
                    <span className="text-brand-700 font-semibold">10/5/2 credits</span>
                    <p className="text-sm text-gray-600 mt-1">Daily/3-day/Weekly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-2">What happens if I run out of credits?</h4>
                  <p className="text-gray-600">
                    You can purchase additional credits at any time. Your subscription will also automatically renew with 400 fresh credits at the start of each billing period.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-2">Do credits expire?</h4>
                  <p className="text-gray-600">
                    Yes, credits expire at the end of each billing cycle. We do this to ensure fair usage and maintain service quality for all users.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-2">What does the 10% ad spend fee cover?</h4>
                  <p className="text-gray-600">
                    The 10% fee is applied to your actual ad spend on platforms and covers our AI optimization services, account management, and technical infrastructure needed to maximize your campaign performance.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-2">Can I switch between optimization frequencies?</h4>
                  <p className="text-gray-600">
                    Yes, you can adjust optimization frequencies for each campaign individually. More frequent optimizations use more credits but can lead to better performance faster.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to transform your ad campaigns?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get started with our Pro Plan today and see the power of AI-driven advertising across Google, Meta, LinkedIn, and Microsoft platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/register'}
                >
                  Start Your Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/features'}
                >
                  Learn More About Features
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
