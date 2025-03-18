
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 md:max-w-3xl mx-auto">
            Get started today with our affordable subscription plan.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-8 text-center gradient-bg text-white">
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-lg ml-2">/month</span>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>400 credits per month (1 campaign = 5 credits)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>AI-generated ad copy and images</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Google & Meta ad campaign management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>24-hour automated campaign optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>10% of ad spend fee via Stripe</span>
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
