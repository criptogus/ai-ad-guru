
import React from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditDisplayProps {
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ 
  className, 
  showIcon = true, 
  compact = false 
}) => {
  const { credits, isLoading } = useCredits();
  
  if (isLoading) {
    return (
      <div className={cn("flex items-center text-sm font-medium", className)}>
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
        <span>Loading...</span>
      </div>
    );
  }
  
  if (!credits) {
    return null;
  }
  
  if (compact) {
    return (
      <div className={cn("text-sm font-medium bg-primary/10 text-primary py-1 px-3 rounded-full", className)}>
        {credits.available} credits
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs text-primary font-bold">₢</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{credits.available} credits available</span>
        {!compact && (
          <span className="text-xs text-muted-foreground">{credits.used} used of {credits.total} total</span>
        )}
      </div>
    </div>
  );
};
