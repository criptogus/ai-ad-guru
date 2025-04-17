
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryAction: string;
  primaryActionText: string;
  secondaryAction: string;
  secondaryActionText: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  primaryAction,
  primaryActionText,
  secondaryAction,
  secondaryActionText
}) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
              <Link to={primaryAction}>{primaryActionText}</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to={secondaryAction}>{secondaryActionText}</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            No credit card required • 14-day free trial • 400 AI credits included
          </motion.p>
        </div>
      </div>
      <div className="absolute w-full h-full inset-0 bg-grid-pattern opacity-5"></div>
    </section>
  );
};
