
import React from "react";
import { BrainCircuit, Sparkles, LineChart } from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How AI Ad Guru Works</h2>
          <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
            Our platform uses advanced AI to create, optimize, and manage your ad campaigns
            across Google and Meta platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Creation</h3>
            <p className="text-gray-600">
              Our AI analyzes your website and generates optimized ad copy and
              creatives tailored to your business.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple Variations</h3>
            <p className="text-gray-600">
              Generate 5 high-performing ad variations with a single click and
              choose the best ones for your campaign.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automatic Optimization</h3>
            <p className="text-gray-600">
              Our AI continuously analyzes performance and optimizes your campaigns
              for maximum ROI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
