
import React from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CreditDisplayProps {
  className?: string;
  showBuyButton?: boolean;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ 
  className,
  showBuyButton = true
}) => {
  const { credits, loading, error } = useCredits();

  if (loading) {
    return (
      <div className={cn("flex items-center gap-1 text-sm", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-sm text-destructive", className)}>
        Error loading credits
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
        <CreditCard className="h-3 w-3" />
        <span className="text-sm font-medium">{credits} Credits</span>
      </div>
      
      {showBuyButton && (
        <Button size="sm" variant="outline" asChild>
          <Link to="/billing">Buy Credits</Link>
        </Button>
      )}
    </div>
  );
};
