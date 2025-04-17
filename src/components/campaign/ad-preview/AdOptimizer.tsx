
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import useAdOptimizer, { OptimizationResult } from '@/hooks/useAdOptimizer';

interface AdOptimizerProps {
  campaignId: string;
  platform: 'Google' | 'Meta' | 'LinkedIn' | 'Microsoft';
  onOptimizationComplete?: (results: OptimizationResult[]) => void;
}

const AdOptimizer: React.FC<AdOptimizerProps> = ({ 
  campaignId, 
  platform, 
  onOptimizationComplete 
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { isOptimizing, progress, results, optimizeGoogleAds, optimizeMetaAds } = useAdOptimizer();

  const handleOptimize = async () => {
    try {
      let optimizationResults: OptimizationResult[] = [];
      
      if (platform === 'Google') {
        optimizationResults = await optimizeGoogleAds(campaignId, frequency);
      } else if (platform === 'Meta') {
        optimizationResults = await optimizeMetaAds(campaignId, frequency);
      } else {
        toast.error(`Optimization for ${platform} is not yet implemented`);
        return;
      }
      
      if (optimizationResults.length > 0 && onOptimizationComplete) {
        onOptimizationComplete(optimizationResults);
        toast.success(`${platform} ads optimized successfully!`);
      }
    } catch (error) {
      console.error(`Error optimizing ${platform} ads:`, error);
      toast.error(`Failed to optimize ${platform} ads`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Optimization
        </CardTitle>
        <CardDescription>
          Analyze and improve your {platform} ads with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={frequency === 'daily' ? 'default' : 'outline'} 
              onClick={() => setFrequency('daily')}
              disabled={isOptimizing}
            >
              Daily (10 credits)
            </Button>
            <Button 
              size="sm" 
              variant={frequency === 'weekly' ? 'default' : 'outline'} 
              onClick={() => setFrequency('weekly')}
              disabled={isOptimizing}
            >
              Weekly (5 credits)
            </Button>
            <Button 
              size="sm" 
              variant={frequency === 'monthly' ? 'default' : 'outline'} 
              onClick={() => setFrequency('monthly')}
              disabled={isOptimizing}
            >
              Monthly (2 credits)
            </Button>
          </div>
          
          {isOptimizing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing and optimizing your {platform} ads...
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing}
          className="w-full"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdOptimizer;
