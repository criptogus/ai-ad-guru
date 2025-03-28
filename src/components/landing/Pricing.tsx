
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [additionalCredits, setAdditionalCredits] = useState(false);

  const perks = [
    "Full AI ad creation & optimization",
    "Image generation powered by DALL·E 3",
    "Smart analytics & auto A/B testing",
    "24/7 campaign management",
    "100 AI credits included monthly"
  ];

  const additionalPerks = [
    "+50 extra AI credits",
    "Priority processing",
    "Advanced campaign templates"
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            No hidden fees, no long-term contracts, cancel anytime
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
          >
            <div className="p-1 bg-gradient-to-r from-brand-400 to-purple-500"></div>
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">$99<span className="text-lg text-gray-500 dark:text-gray-400">/month</span></h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">All features included</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
              
              <div className="py-4 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="add-credits" 
                      checked={additionalCredits}
                      onCheckedChange={setAdditionalCredits}
                    />
                    <Label htmlFor="add-credits" className="font-medium text-gray-900 dark:text-gray-100">
                      Add Power Pack
                    </Label>
                  </div>
                  <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    +$49/mo
                  </span>
                </div>
                
                {additionalCredits && (
                  <div className="space-y-2 pl-8 text-sm text-gray-600 dark:text-gray-400 border-l-2 border-brand-200 dark:border-brand-800">
                    {additionalPerks.map((perk, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-500 mr-1.5 flex-shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full py-6 bg-brand-600 hover:bg-brand-700 text-white font-medium flex items-center justify-center gap-2 group"
                onClick={() => navigate("/register")}
              >
                Get Started Now 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No credit card required to start your free 14-day trial
                </p>
                <p className="text-xs font-medium text-red-500 mt-2 animate-pulse">
                  Limited spots available at launch price
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
