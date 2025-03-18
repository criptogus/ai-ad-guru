
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create High-Converting Ads with AI
        </h1>
        <p className="text-xl md:text-2xl mb-8 md:max-w-3xl mx-auto">
          Generate, optimize, and manage your Google and Meta ads with the power
          of GPT-4 and DALL-E 3. Less effort, better results.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100"
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
      </div>
    </section>
  );
};
