
import React from "react";

export const Process: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 3-Step Process</h2>
          <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
            Creating high-converting ad campaigns has never been easier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Enter Your Website</h3>
            <p className="text-gray-600">
              Provide your website URL and our AI will analyze your business
              and industry.
            </p>
          </div>

          <div className="text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Select Ad Type</h3>
            <p className="text-gray-600">
              Choose between Google Search Ads or Meta (Facebook/Instagram) 
              image ads.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Launch Campaign</h3>
            <p className="text-gray-600">
              Review AI-generated ads, make edits if needed, and publish
              to platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
