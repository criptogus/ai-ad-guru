import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export const Cta: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Launch Winning Ads Today
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join 5K+ pros using the future of advertising. 
            Save time, increase ROAS, and grow your business with AI.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-brand-700 text-lg px-8 py-6 font-semibold relative z-10 overflow-hidden group"
              onClick={() => navigate("/auth/register")}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-200 to-brand-300 opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-0"></span>
              <Zap className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">Start Free Trial Now</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Animated ring */}
            <span className="absolute inset-0 rounded-md ring-4 ring-white/30 animate-pulse"></span>
          </motion.div>
          
          <p className="mt-6 text-sm opacity-80">
            14-day free trial • 5 credits included • No credit card required
          </p>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};
