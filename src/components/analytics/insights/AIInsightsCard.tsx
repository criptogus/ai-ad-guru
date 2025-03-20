
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Zap, Target, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AIInsight {
  campaign_id: string;
  title: string;
  description: string;
  category: "performance" | "budget" | "creative" | "audience" | "technical";
}

interface AIInsightsCardProps {
  insights?: AIInsight[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ 
  insights: propInsights, 
  isLoading: propIsLoading,
  onRefresh 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>(propInsights || []);
  const [isLoading, setIsLoading] = useState<boolean>(propIsLoading || false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch insights if they weren't provided as props
  useEffect(() => {
    if (propInsights) {
      setInsights(propInsights);
      return;
    }
    
    if (user) {
      fetchInsights();
    }
  }, [user, propInsights]);
  
  // Update state if props change
  useEffect(() => {
    if (propInsights) {
      setInsights(propInsights);
    }
    
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propInsights, propIsLoading]);
  
  const fetchInsights = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign-insights', {
        body: { userId: user.id }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else {
        setInsights([]);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to load insights. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      fetchInsights();
    }
  };
  
  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'creative': return <Lightbulb className="h-4 w-4" />;
      case 'audience': return <Target className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'technical': return <Settings className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };
  
  // Get color class based on category
  const getCategoryColorClass = (category: string): string => {
    switch(category) {
      case 'creative': return 'text-purple-600';
      case 'audience': return 'text-blue-600';
      case 'performance': return 'text-green-600';
      case 'budget': return 'text-orange-600';
      case 'technical': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">AI Campaign Insights</CardTitle>
            <CardDescription>
              AI-powered recommendations to improve performance
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing your campaigns...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        ) : insights.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No insights available. Create campaigns to get AI-powered recommendations.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${getCategoryColorClass(insight.category)}`}>
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">{insight.description}</p>
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {insights.length > 0 && (
        <CardFooter className="p-3 border-t flex justify-center">
          <Button variant="ghost" size="sm" className="text-xs text-blue-600">
            View All Insights
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIInsightsCard;
