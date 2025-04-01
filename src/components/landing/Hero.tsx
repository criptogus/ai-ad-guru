
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={primaryAction}>{primaryActionText}</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to={secondaryAction}>{secondaryActionText}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute w-full h-full inset-0 bg-grid-pattern opacity-5"></div>
    </section>
  );
};
