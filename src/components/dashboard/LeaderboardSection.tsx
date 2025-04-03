
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LeaderboardSectionProps {
  campaigns: Campaign[];
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  // Sort campaigns by performance metrics
  const sortedByCTR = [...campaigns].sort((a, b) => 
    (b.performance?.ctr || 0) - (a.performance?.ctr || 0)
  ).slice(0, 3);
  
  const needsAttention = [...campaigns].filter(campaign => 
    (campaign.performance?.ctr || 0) < 1.5 || 
    campaign.status === 'paused' ||
    (campaign.performance?.spend || 0) > (campaign.budget * 0.9)
  ).slice(0, 3);

  // Helper function to get platform badge style
  const getPlatformStyle = (platform: string) => {
    switch(platform?.toLowerCase()) {
      case "google": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "meta": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Helper function to get status badge style
  const getStatusStyle = (status: string) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Top Performing Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedByCTR.length > 0 ? (
              sortedByCTR.map((campaign, index) => (
                <div key={campaign.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-sm">{campaign.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPlatformStyle(campaign.platform)}`}>
                        {campaign.platform}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      CTR: {campaign.performance?.ctr.toFixed(2)}% • Conversions: {campaign.performance?.conversions}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                No campaigns available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
            Needs Attention
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {needsAttention.length > 0 ? (
              needsAttention.map((campaign) => (
                <div key={campaign.id} className="p-4 hover:bg-muted/50 transition-colors flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{campaign.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {campaign.status === 'paused' 
                        ? 'Campaign is paused and not delivering' 
                        : `Budget: $${campaign.performance?.spend.toFixed(2)}/$${campaign.budget} (${((campaign.performance?.spend || 0) / campaign.budget * 100).toFixed(0)}%)`}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    Fix
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                All campaigns performing well
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardSection;
