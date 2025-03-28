
import React from "react";
import { motion } from "framer-motion";
import { 
  Layers, Cpu, Edit, BarChart, Users, Globe, 
  LifeBuoy, Sparkles, Clock, Palette, Image, Zap 
} from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Layers className="h-6 w-6 text-brand-600" />,
      title: "Multi-Platform Ads",
      description: "Create and manage ads for Google, Meta, LinkedIn, and Microsoft from one dashboard."
    },
    {
      icon: <Cpu className="h-6 w-6 text-emerald-600" />,
      title: "AI Strategist",
      description: "Our AI analyzes, tests, and optimizes your campaigns 24/7 for maximum ROAS."
    },
    {
      icon: <Edit className="h-6 w-6 text-brand-600" />,
      title: "Editable Previews",
      description: "Get AI-generated ad variations with full editing control before publishing."
    },
    {
      icon: <BarChart className="h-6 w-6 text-emerald-600" />,
      title: "Smart Analytics",
      description: "Real-time insights and automatic A/B testing to continuously improve performance."
    },
    {
      icon: <Users className="h-6 w-6 text-brand-600" />,
      title: "Universal Fit",
      description: "Works for products, services, B2B, coaches, agencies, and more."
    },
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: "Multilingual Magic",
      description: "Create ads in multiple languages with tone adaptation for global markets."
    },
    {
      icon: <Image className="h-6 w-6 text-brand-600" />,
      title: "DALL·E 3 Imaging",
      description: "Generate stunning ad visuals with the latest AI image technology from OpenAI."
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      title: "Automatic Scheduling",
      description: "Set it and forget it with smart timing for maximum audience engagement."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-brand-600" />,
      title: "Mental Triggers",
      description: "Leverage powerful psychological triggers to boost ad conversions."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, optimize, and scale your advertising
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
            >
              <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
