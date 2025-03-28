
import React from "react";
import { motion } from "framer-motion";
import { Link, Globe, Brain, Zap, TrendingUp } from "lucide-react";

export const Process: React.FC = () => {
  const steps = [
    {
      icon: <Link className="h-6 w-6 text-brand-600" />,
      title: "Connect Your Accounts",
      description: "Securely link your ad accounts with OAuth. No passwords stored."
    },
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: "Add Your Website",
      description: "Our AI analyzes your site to understand your brand, audience, and goals."
    },
    {
      icon: <Brain className="h-6 w-6 text-brand-600" />,
      title: "AI Scans Your Brand",
      description: "GPT-4o identifies your unique selling points and competitive advantages."
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      title: "Generate Ads Instantly",
      description: "Get 5 high-converting ad variations across all platforms in seconds."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-brand-600" />,
      title: "AI Optimizes Daily",
      description: "Smart algorithms reallocate budget to top performers and test new ideas."
    }
  ];

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
      transition: { duration: 0.5 }
    }
  };

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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Launch winning ad campaigns in minutes, not days
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full md:w-3/4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-start gap-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {step.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
