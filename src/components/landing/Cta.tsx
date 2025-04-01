
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CtaProps {
  title: string;
  subtitle: string;
  primaryAction: string;
  primaryActionText: string;
  secondaryAction: string;
  secondaryActionText: string;
}

export const Cta: React.FC<CtaProps> = ({
  title,
  subtitle,
  primaryAction,
  primaryActionText,
  secondaryAction,
  secondaryActionText
}) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
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
    </section>
  );
};
