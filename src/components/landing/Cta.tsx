
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart4 } from "lucide-react";

export const Cta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20 text-white mb-6">
              <Zap size={16} className="mr-1" />
              BOOST YOUR ROAS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Ready to Transform Your Ad Performance?</h2>
            <p className="text-xl mb-8">
              Join businesses using AI Ad Guru to create high-converting ads and reduce their cost per acquisition by an average of 37%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100 shadow-lg"
                onClick={() => navigate("/register")}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-white text-white bg-white/10 hover:bg-white/30"
                onClick={() => navigate("/pricing")}
              >
                View Pricing
              </Button>
            </div>
            <p className="text-sm mt-4 text-white/70">
              No credit card required • 14-day free trial • 5 credits included
            </p>
          </div>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-500 rounded-full mr-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Performance Impact</h3>
                <p className="text-white/70">Average results from our customers</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Click-Through Rate</span>
                  <span className="font-bold text-brand-400">+43%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-brand-400 h-2 rounded-full" style={{ width: "43%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Conversion Rate</span>
                  <span className="font-bold text-brand-400">+37%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-brand-400 h-2 rounded-full" style={{ width: "37%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Time Saved</span>
                  <span className="font-bold text-brand-400">+82%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-brand-400 h-2 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
