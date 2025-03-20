
import React from "react";
import { BrainCircuit, Sparkles, LineChart, Target, Zap, Clock } from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="features">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-100 text-brand-700 mb-4">
            AI TECHNOLOGY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our AI Boosts Your Ad Performance</h2>
          <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
            Our platform analyzes millions of high-performing ads to create
            campaigns that convert better with less effort.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">GPT-4 Powered Copy</h3>
            <p className="text-gray-600">
              Generate 5 high-converting ad variations for Google, Meta, LinkedIn, and Microsoft with copy that speaks directly to your audience's pain points.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">DALL·E 3 Images</h3>
            <p className="text-gray-600">
              Create scroll-stopping social media ad visuals for Meta and LinkedIn that drive engagement and conversions (5 credits per image).
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">24h Optimization</h3>
            <p className="text-gray-600">
              AI automatically pauses low performers and reallocates budget to winning ads (saves 10 credits).
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Audience Targeting</h3>
            <p className="text-gray-600">
              AI identifies your ideal customer segments for laser-focused targeting across Google, Meta, LinkedIn, and Microsoft platforms.
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
  );
};
