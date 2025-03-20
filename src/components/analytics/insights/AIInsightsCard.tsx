
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Zap, Target, Settings, Loader2, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AIInsight {
  campaign_id: string;
  title: string;
  description: string;
  category: "performance" | "budget" | "creative" | "audience" | "technical";
}

interface AIRecommendation {
  campaign_id: string;
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
  expected_impact: string;
}

interface AIRankedCampaign {
  campaign_id: string;
  name: string;
  ranking: number;
  reason: string;
  category: string;
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
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [rankedCampaigns, setRankedCampaigns] = useState<AIRankedCampaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(propIsLoading || false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'insights' | 'recommendations'>('insights');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
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
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations([]);
      }
      
      if (data.ranked_campaigns && Array.isArray(data.ranked_campaigns)) {
        setRankedCampaigns(data.ranked_campaigns);
      } else {
        setRankedCampaigns([]);
      }
      
      toast({
        title: "Insights updated",
        description: "AI has analyzed your campaigns and provided fresh insights",
      });
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
  
  // Toggle expanding an item
  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
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
  
  // Get priority color class
  const getPriorityColorClass = (priority: string): string => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">AI Campaign Insights</CardTitle>
            <CardDescription>
              OpenAI-powered recommendations to improve performance
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
            <p className="text-sm text-muted-foreground">Analyzing your campaigns with OpenAI...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        ) : insights.length === 0 && recommendations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No insights available. Create campaigns to get AI-powered recommendations.
            </p>
          </div>
        ) : (
          <div>
            <div className="border-b">
              <div className="flex">
                <Button 
                  variant={activeSection === 'insights' ? 'default' : 'ghost'}
                  className="rounded-none flex-1"
                  onClick={() => setActiveSection('insights')}
                >
                  Insights
                </Button>
                <Button 
                  variant={activeSection === 'recommendations' ? 'default' : 'ghost'}
                  className="rounded-none flex-1"
                  onClick={() => setActiveSection('recommendations')}
                >
                  Actions
                </Button>
              </div>
            </div>
            
            {activeSection === 'insights' ? (
              <div className="divide-y">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 ${getCategoryColorClass(insight.category)}`}>
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => toggleExpand(`insight-${index}`)}
                          >
                            {expandedItems.has(`insight-${index}`) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        
                        {expandedItems.has(`insight-${index}`) && (
                          <p className="text-xs text-muted-foreground mt-1 mb-2">{insight.description}</p>
                        )}
                        
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            Apply
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColorClass(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{rec.action}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => toggleExpand(`rec-${index}`)}
                          >
                            {expandedItems.has(`rec-${index}`) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        
                        {expandedItems.has(`rec-${index}`) && (
                          <>
                            <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                            <p className="text-xs text-blue-600 mt-1 mb-2">
                              Expected impact: {rec.expected_impact}
                            </p>
                          </>
                        )}
                        
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            Apply Now
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      {(insights.length > 0 || recommendations.length > 0) && (
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
