
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle, BarChart, Brain, Layers } from "lucide-react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              <Zap size={16} className="mr-1" />
              AI-Powered Ad Management
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-gray-900 dark:text-gray-50">
            Grow Faster with <span className="text-brand-600 dark:text-brand-400">AI-Powered Ads</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8 md:max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            Launch high-ROI ads on Google, Meta, LinkedIn, and Microsoft—no expertise needed.
          </motion.p>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-10 text-left">
            <div className="flex items-start">
              <CheckCircle className="text-brand-500 mr-2 mt-1 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">5 AI-optimized ad variations per campaign</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-brand-500 mr-2 mt-1 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">24h automated performance optimization</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-brand-500 mr-2 mt-1 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">DALL·E 3 image generation included</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="text-lg px-8 bg-brand-600 hover:bg-brand-700 text-white shadow-lg relative overflow-hidden group"
              onClick={() => navigate("/register")}
            >
              <span className="relative z-10">Start Free Trial</span>
              <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 dark:hover:border-brand-700"
              onClick={() => navigate("/pricing")}
            >
              See It in Action
            </Button>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-sm mt-4 text-gray-500 dark:text-gray-400">
            Join 5K+ marketers • No credit card required • 14-day free trial • 5 credits included
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-12 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-brand-400 to-purple-500"></div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2 text-center">
                  <Layers className="h-8 w-8 mx-auto text-brand-500" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Multi-Platform</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Google, Meta, LinkedIn & Microsoft ads</p>
                </div>
                <div className="space-y-2 text-center">
                  <Brain className="h-8 w-8 mx-auto text-brand-500" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Strategist</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Analyzes, tests & optimizes 24/7</p>
                </div>
                <div className="space-y-2 text-center">
                  <BarChart className="h-8 w-8 mx-auto text-brand-500" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart Analytics</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real-time insights & optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 via-purple-500 to-brand-600 rounded-xl blur-xl opacity-20 -z-10 animate-pulse-slow"></div>
        </motion.div>
      </div>
    </section>
  );
};
