
import { useState } from 'react';
import { optimizeAds, OptimizationGoal, OptimizationRequest, OptimizedGoogleAd, OptimizedMetaAd } from '@/services/api/optimizerApi';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';
import { getCreditCost } from '@/services/credits';
import { checkUserCredits, deductUserCredits } from '@/services/credits';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface UseAdOptimizerReturn {
  optimizeGoogleAds: (ads: GoogleAd[], performance?: any, goal?: OptimizationGoal) => Promise<OptimizedGoogleAd[] | null>;
  optimizeMetaAds: (ads: MetaAd[], performance?: any, goal?: OptimizationGoal) => Promise<OptimizedMetaAd[] | null>;
  isOptimizing: boolean;
}

export { type OptimizationGoal }; // Re-export the OptimizationGoal type

export const useAdOptimizer = (): UseAdOptimizerReturn => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const optimizationAction = "adOptimization.daily" as const;
  const { user } = useAuth();

  const optimizeGoogleAds = async (
    ads: GoogleAd[],
    performance?: any,
    goal?: OptimizationGoal
  ): Promise<OptimizedGoogleAd[] | null> => {
    if (!ads || ads.length === 0) {
      toast({
        title: "Optimization Failed",
        description: "No ads provided for optimization",
        variant: "destructive",
      });
      return null;
    }

    // Check if user has enough credits
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to optimize ads",
        variant: "destructive",
      });
      return null;
    }

    const { hasEnough, required } = await checkUserCredits(user.id, optimizationAction);
    
    if (!hasEnough) {
      toast({
        title: "Not Enough Credits",
        description: `You need ${required} credits to optimize ads. Please purchase more credits.`,
        variant: "destructive",
      });
      return null;
    }

    setIsOptimizing(true);
    
    try {
      const request: OptimizationRequest = {
        ads,
        platform: 'google',
        performance,
        optimizationGoal: goal
      };
      
      const optimizedAds = await optimizeAds<OptimizedGoogleAd>(request);
      
      if (optimizedAds) {
        await deductUserCredits(
          user.id,
          optimizationAction,
          "Ad Optimization",
          `Optimized ${optimizedAds.length} Google ads`
        );
        
        toast({
          title: "Optimization Complete",
          description: `Successfully created ${optimizedAds.length} optimized ad variations`,
        });
        
        return optimizedAds;
      }
      
      return null;
    } catch (error) {
      console.error("Error optimizing Google ads:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  const optimizeMetaAds = async (
    ads: MetaAd[],
    performance?: any,
    goal?: OptimizationGoal
  ): Promise<OptimizedMetaAd[] | null> => {
    if (!ads || ads.length === 0) {
      toast({
        title: "Optimization Failed",
        description: "No ads provided for optimization",
        variant: "destructive",
      });
      return null;
    }

    // Check if user has enough credits
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to optimize ads",
        variant: "destructive",
      });
      return null;
    }

    const { hasEnough, required } = await checkUserCredits(user.id, optimizationAction);
    
    if (!hasEnough) {
      toast({
        title: "Not Enough Credits",
        description: `You need ${required} credits to optimize ads. Please purchase more credits.`,
        variant: "destructive",
      });
      return null;
    }

    setIsOptimizing(true);
    
    try {
      const request: OptimizationRequest = {
        ads,
        platform: 'meta',
        performance,
        optimizationGoal: goal
      };
      
      const optimizedAds = await optimizeAds<OptimizedMetaAd>(request);
      
      if (optimizedAds) {
        await deductUserCredits(
          user.id,
          optimizationAction,
          "Ad Optimization",
          `Optimized ${optimizedAds.length} Meta/Instagram ads`
        );
        
        toast({
          title: "Optimization Complete",
          description: `Successfully created ${optimizedAds.length} optimized ad variations`,
        });
        
        return optimizedAds;
      }
      
      return null;
    } catch (error) {
      console.error("Error optimizing Meta ads:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    optimizeGoogleAds,
    optimizeMetaAds,
    isOptimizing
  };
};
