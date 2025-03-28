
import React from "react";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

export const Trust: React.FC = () => {
  const logos = [
    { name: "PeakPulse", logo: "logo-1.svg" },
    { name: "GrowEasy", logo: "logo-2.svg" },
    { name: "RapidScale", logo: "logo-3.svg" },
    { name: "BrightPath", logo: "logo-4.svg" },
    { name: "TechFlow", logo: "logo-5.svg" },
  ];

  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Trusted by 5,000+ creators, agencies, and startups in 15+ countries
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {logos.map((item, index) => (
            <div 
              key={index} 
              className="grayscale opacity-75 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            >
              <img 
                src={`/placeholder.svg`} 
                alt={`${item.name} logo`} 
                className="h-8 object-contain" 
              />
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
              4.9/5 from 127 reviews
            </span>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 italic text-center">
              "ROAS up 3x! Zero Digital Agency's AI platform completely transformed how we run ads. 
              It's like having an expert agency team working 24/7 on our campaigns."
            </p>
            <div className="mt-4 text-center">
              <p className="font-medium text-gray-900 dark:text-gray-100">Jane Smith</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director, TechFlow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
