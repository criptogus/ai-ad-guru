
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@/models/CampaignTypes";
import { TrendingUp, TrendingDown, CircleDot, DollarSign, Layers, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface CampaignSummaryCardsProps {
  campaigns: Campaign[];
}

interface ExtendedCampaign extends Campaign {
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
}

const CampaignSummaryCards: React.FC<CampaignSummaryCardsProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch(platform?.toLowerCase()) {
      case 'google':
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.5 12.5c0-.83-.067-1.633-.2-2.4H12v4.533h5.9c-.25 1.367-.975 2.517-2.074 3.3v2.734h3.367c1.971-1.825 3.106-4.517 3.106-7.7z" fill="#4285F4"/>
          <path d="M12 23c2.825 0 5.192-.933 6.913-2.533l-3.367-2.6c-.933.633-2.125 1-3.546 1-2.729 0-5.046-1.833-5.883-4.3H2.638v2.683C4.352 20.775 7.912 23 12 23z" fill="#34A853"/>
          <path d="M6.117 14.567C5.9 13.925 5.775 13.242 5.775 12.5c0-.742.125-1.425.342-2.067V7.75H2.638C1.983 9.187 1.6 10.8 1.6 12.5c0 1.7.383 3.313 1.038 4.75l3.479-2.683z" fill="#FBBC05"/>
          <path d="M12 5.7c1.533 0 2.921.525 4.01 1.558l2.98-2.953C17.21 2.64 14.843 1.6 12 1.6c-4.088 0-7.648 2.225-9.362 5.75L6.117 10.033C6.955 7.567 9.27 5.7 12 5.7z" fill="#EA4335"/>
        </svg>;
      case 'meta':
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" fill="#1877F2"/>
          <path d="M13 18.5h-2v-5.692H9.5V11.12h1.5v-1.5c0-1.732.66-2.812 2.55-2.812h1.9v1.687h-1.35c-.75 0-.85.281-.85.938V11.1h2.062l-.25 1.688h-1.812V18.5z" fill="white"/>
        </svg>;
      case 'linkedin':
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#0A66C2"/>
          <path d="M7 10h2v7H7v-7zm1-3c-.667 0-1 .333-1 1s.333 1 1 1 1-.333 1-1-.333-1-1-1zM10 10h2v1l.062-.05c.323-.278.687-.476 1.092-.593.405-.116.825-.175 1.26-.175 1.2 0 2.092.288 2.677.864.584.576.876 1.536.876 2.88V17h-2v-2.7c0-.74-.117-1.273-.352-1.6-.235-.327-.64-.49-1.216-.49-.38 0-.722.09-1.025.27-.303.181-.53.45-.68.805-.13.333-.196.883-.196 1.65v2.1h-2v-7.035z" fill="white"/>
        </svg>;
      case 'microsoft':
        return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
          <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
          <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
          <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
        </svg>;
      default:
        return <CircleDot className="h-5 w-5" />;
    }
  };
  
  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "draft": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };
  
  // Helper function to determine performance trend
  const getPerformanceTrend = (campaign: Campaign) => {
    if (!campaign.performance || campaign.id.includes("3") || campaign.id.includes("6")) {
      return {
        direction: "down",
        percentage: Math.floor(Math.random() * 10 + 5),
      };
    }
    
    return {
      direction: "up",
      percentage: Math.floor(Math.random() * 15 + 5),
    };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium mb-4">Campaign Performance</h2>
      {campaigns.map((campaign) => {
        const extendedCampaign = campaign as ExtendedCampaign;
        const trend = getPerformanceTrend(campaign);
        const ctr = extendedCampaign.performance?.ctr || 0;
        const impressions = extendedCampaign.performance?.impressions || 0;
        const spent = extendedCampaign.performance?.spend || 0;
        const conversions = extendedCampaign.performance?.conversions || 0;
        const budgetPercentage = (spent / campaign.budget) * 100;
        
        return (
          <Card 
            key={campaign.id} 
            className="overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer mb-4"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <CardContent className="p-0">
              {/* Header - More prominence */}
              <div className="p-4 flex items-center justify-between border-b bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-full p-2">
                    {getPlatformIcon(campaign.platform)}
                  </div>
                  <div>
                    <h3 className="font-medium text-base line-clamp-1">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(campaign.status)}`}>
                        {campaign.status}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(campaign.startDate).toLocaleDateString()}
                        {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Metrics - Now in a grid layout for better space utilization */}
              <div className="p-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Activity className="h-3 w-3" />
                      <span>CTR</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{ctr.toFixed(2)}%</span>
                      <div className="ml-2 flex items-center text-xs">
                        {trend.direction === "up" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900 flex items-center gap-0.5 font-normal">
                            <TrendingUp className="h-3 w-3" />
                            {trend.percentage}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900 flex items-center gap-0.5 font-normal">
                            <TrendingDown className="h-3 w-3" />
                            {trend.percentage}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Layers className="h-3 w-3" />
                      <span>Impressions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{impressions.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span>Spend</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">${spent.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span>Conversions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{conversions}</span>
                    </div>
                  </div>
                </div>
                
                {/* Budget progress */}
                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Budget usage</span>
                    <span className="font-medium">${spent} / ${campaign.budget}</span>
                  </div>
                  <Progress 
                    value={budgetPercentage} 
                    className={`h-2 ${budgetPercentage > 85 ? 'bg-red-200' : 'bg-muted'}`}
                    indicatorClassName={budgetPercentage > 85 ? 'bg-red-600' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CampaignSummaryCards;
