
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, LucideCheck } from "lucide-react";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20 text-white">
            <Zap size={16} className="mr-1" />
            AI-Powered Ad Management
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Create & Optimize Ads That <span className="text-brand-400">Actually Convert</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 md:max-w-3xl mx-auto">
          Get 5X better ROAS with AI-generated Google & Meta ads. No copywriting 
          skills needed. Just connect your accounts and let our AI handle the rest.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-10 text-left">
          <div className="flex items-start">
            <LucideCheck className="text-brand-400 mr-2 mt-1 shrink-0" />
            <span>5 AI-optimized ad variations per campaign</span>
          </div>
          <div className="flex items-start">
            <LucideCheck className="text-brand-400 mr-2 mt-1 shrink-0" />
            <span>24h automated performance optimization</span>
          </div>
          <div className="flex items-start">
            <LucideCheck className="text-brand-400 mr-2 mt-1 shrink-0" />
            <span>DALL·E 3 image generation included</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100 shadow-lg"
            onClick={() => navigate("/register")}
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-white text-white bg-white/10 hover:bg-white/30 font-semibold"
            onClick={() => navigate("/pricing")}
          >
            View Pricing
          </Button>
        </div>
        
        <p className="text-sm mt-4 text-white/70">
          No credit card required • 14-day free trial • 5 credits included
        </p>
      </div>
    </section>
  );
};
