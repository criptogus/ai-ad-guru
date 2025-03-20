
import React from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { CheckCircle, Zap, Target, Users, Globe, Sparkles } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | Zero Digital Agency</title>
        <meta name="description" content="Learn about Zero Digital Agency's AI-powered ad automation platform for Google Ads, Meta Ads, LinkedIn Ads, and Microsoft Ads." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-brand-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">👥 About</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Zero Digital Agency – AI-Powered Ad Automation
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">🚀 Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                At <span className="font-semibold">Zero Digital Agency</span>, we believe that <span className="font-semibold">advertising should be smarter, not harder</span>. Our mission is to <span className="font-semibold">help businesses scale their digital campaigns effortlessly</span> with <span className="font-semibold">AI-powered automation and optimization</span>.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">🎯 What We Do</h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide a <span className="font-semibold">cutting-edge AI ad management platform</span> that enables businesses to:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Create high-performing ad campaigns</span> in seconds using AI-generated ad copy & images.
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Optimize campaigns 24/7</span> with real-time AI analysis and automated budget allocation.
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Manage multi-platform ads</span> across Google Ads, Meta Ads, LinkedIn Ads, and Microsoft Ads from a single dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">🌍 Our Vision</h2>
              <p className="text-lg text-gray-600 mb-8">
                We want to <span className="font-semibold">revolutionize digital marketing</span> by giving businesses of all sizes access to <span className="font-semibold">enterprise-level ad automation</span> without the complexity or high costs.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">🤖 Our AI-Driven Approach</h2>
              <p className="text-lg text-gray-600 mb-8">
                Unlike traditional ad agencies, we use <span className="font-semibold">state-of-the-art AI technology</span> to:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Zap className="h-6 w-6 text-brand-600 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Write ad copy & create ad creatives automatically.</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <Target className="h-6 w-6 text-brand-600 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Continuously test and optimize ads</span> based on real-time performance.
                  </p>
                </div>
                <div className="flex items-start">
                  <Sparkles className="h-6 w-6 text-brand-600 mr-3 mt-1 shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Reduce wasted ad spend</span> by ensuring every dollar is invested in high-converting ads.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">💡 Why Choose Zero Digital Agency?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Zap className="h-10 w-10 text-brand-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">AI-Driven Automation</h3>
                  <p className="text-gray-600">Let AI do the hard work while you focus on growth.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Globe className="h-10 w-10 text-brand-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Multi-Platform Support</h3>
                  <p className="text-gray-600">Manage all your campaigns in one place.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <Target className="h-10 w-10 text-brand-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Cost-Effective & Scalable</h3>
                  <p className="text-gray-600">No hidden fees, just smarter ad management.</p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">📍 Our Team</h2>
              <p className="text-lg text-gray-600 mb-8">
                We are a group of <span className="font-semibold">digital marketing specialists, AI engineers, and performance-driven advertisers</span> passionate about making AI <span className="font-semibold">accessible to businesses worldwide</span>.
              </p>
              
              <div className="bg-brand-50 p-6 rounded-xl text-center">
                <p className="text-lg mb-2">
                  📩 <span className="font-semibold">Want to know more?</span> Reach out to us at <span className="font-semibold">contact@zerodigital.com</span> 🚀
                </p>
                <p className="text-xl font-bold text-brand-600">
                  🔥 Join us in the future of AI-powered advertising!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
