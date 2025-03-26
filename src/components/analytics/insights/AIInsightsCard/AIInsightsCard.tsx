
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIInsightsSuggestions } from './AIInsightsSuggestions';
import { AdActions } from './AdActions';
import { ControlsSection } from './ControlsSection';
import { MessageCircle, BarChart } from 'lucide-react';
import { GoogleAdTab } from './tabs/GoogleAdTab';
import { MetaAdTab } from './tabs/MetaAdTab';
import { MicrosoftAdTab } from './tabs/MicrosoftAdTab';

interface AIInsightsCardProps {
  campaignId?: string; // Making campaignId optional to fix related errors
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ campaignId = "campaign-1" }) => {
  const [selectedTab, setSelectedTab] = useState('insights');
  const [selectedPlatform, setSelectedPlatform] = useState('google');
  const [accepting, setAccepting] = useState(false);
  const [insights, setInsights] = useState(['Performance is below average compared to similar campaigns', 'CTR is 30% lower than the industry standard', 'Consider revising ad copy to highlight unique value propositions', 'Test different call-to-action phrases to improve engagement']);

  // Example sitelinks - corrected to match interface
  const sitelinks = [
    { title: "Our Services", link: "/services" },
    { title: "Pricing Plans", link: "/pricing" },
    { title: "Success Stories", link: "/testimonials" },
    { title: "Free Consultation", link: "/contact" }
  ];

  const handleAcceptSuggestion = () => {
    setAccepting(true);
    // Simulate API call
    setTimeout(() => {
      setAccepting(false);
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>AI Performance Insights</span>
          <Tabs 
            value={selectedTab} 
            className="w-auto" 
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="insights" className="text-xs px-3 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="ads" className="text-xs px-3 flex items-center gap-1">
                <BarChart className="w-3 h-3" />
                <span>Ads</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
        <CardDescription>
          AI-powered analysis and recommendations for campaign optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {selectedTab === 'insights' ? (
          <AIInsightsSuggestions 
            insights={insights} 
            onAccept={handleAcceptSuggestion}
            accepting={accepting}
          />
        ) : (
          <div className="space-y-4">
            <ControlsSection 
              selectedPlatform={selectedPlatform} 
              onPlatformChange={setSelectedPlatform}
            />
            
            <div className="border rounded-md bg-slate-50 p-4">
              {selectedPlatform === 'google' && (
                <GoogleAdTab sitelinks={sitelinks} />
              )}
              {selectedPlatform === 'meta' && (
                <MetaAdTab />
              )}
              {selectedPlatform === 'microsoft' && (
                <MicrosoftAdTab />
              )}
            </div>
            
            <AdActions 
              onCreateABTest={() => {}} 
              onCopyAd={() => {}}
            />
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Last updated: Today at 9:30 AM • Analyzing 30 days of data
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
