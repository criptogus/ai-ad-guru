
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BarChart, BrainCircuit, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const AiInsights: React.FC = () => {
  const [expandedInsight, setExpandedInsight] = React.useState<number | null>(null);
  
  const insights = [
    {
      id: 1,
      title: "Increase CTR by 24%",
      description: "Your Google Ads could perform better by adding more emotional triggers. Consider using 'Urgency' and 'Scarcity' in your ad copy.",
      action: "Optimize Google Ads",
      actionPath: "/campaign/1?tab=google",
      category: "performance",
      impact: "high"
    },
    {
      id: 2,
      title: "Budget optimization opportunity",
      description: "Shift 30% of your 'Summer Sale' budget to your 'Product Launch' campaign to maximize ROAS based on last week's performance data.",
      action: "Adjust budgets",
      actionPath: "/campaigns",
      category: "budget",
      impact: "medium"
    },
    {
      id: 3,
      title: "New audience segment identified",
      description: "Data shows professionals aged 28-35 are engaging most with your ads. Consider creating a dedicated campaign for this segment.",
      action: "Create segment",
      actionPath: "/create-campaign",
      category: "audience",
      impact: "high"
    }
  ];
  
  const toggleInsight = (id: number) => {
    if (expandedInsight === id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(id);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'budget':
        return <BarChart className="h-4 w-4 text-green-500" />;
      case 'audience':
        return <BrainCircuit className="h-4 w-4 text-purple-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="border rounded-lg p-4 hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div>
                    <h3 className="font-medium">{insight.title}</h3>
                    {expandedInsight === insight.id ? (
                      <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground truncate max-w-xs sm:max-w-md md:max-w-lg">
                        {insight.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  onClick={() => toggleInsight(insight.id)}
                >
                  {expandedInsight === insight.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedInsight === insight.id && (
                <div className="mt-4 flex items-center justify-between">
                  <div className={`text-xs px-2 py-1 rounded ${getImpactColor(insight.impact)}`}>
                    {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} impact
                  </div>
                  <Button size="sm" className="gap-1 bg-blue-500 hover:bg-blue-600">
                    {insight.action}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsights;
