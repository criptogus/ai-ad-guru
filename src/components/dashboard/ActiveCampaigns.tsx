
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/models/CampaignTypes";
import { ChevronRight, Flag, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveCampaignsProps {
  campaigns: Campaign[];
}

const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  // Get active campaigns
  const activeCampaigns = campaigns.filter(campaign => 
    campaign.status === 'active');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Flag className="h-5 w-5 mr-2 text-primary" />
          Active Campaigns
        </h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>
          View All
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {activeCampaigns.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No active campaigns</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Get started by creating your first campaign to reach your audience across Google and Meta platforms.
              </p>
              <Button onClick={() => navigate("/create-campaign")} className="gap-2">
                <PlusCircle size={18} />
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();
  
  const getStatusColor = () => {
    switch (campaign.status) {
      case 'active': return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'paused': return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case 'pending': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'expired': return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getPlatformBadge = () => {
    switch (campaign.platform) {
      case 'google': return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case 'meta': return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getCtrTrend = () => {
    const ctr = campaign.performance?.ctr || 0;
    return ctr > 0.02 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-5 flex-grow">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{campaign.name}</h3>
                <Badge className={getPlatformBadge()} variant="outline">
                  {campaign.platform === "google" ? "Google" : "Meta"}
                </Badge>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-4">
              <StatItem 
                label="Budget" 
                value={`$${campaign.budget}`} 
                subvalue={campaign.budgetType} 
              />
              <StatItem 
                label="Impressions" 
                value={campaign.performance?.impressions.toLocaleString() || "0"} 
              />
              <StatItem 
                label="CTR" 
                value={`${((campaign.performance?.ctr || 0) * 100).toFixed(2)}%`} 
                trend={getCtrTrend()}
              />
              <StatItem 
                label="Spend" 
                value={`$${campaign.performance?.spend.toFixed(2) || "0"}`} 
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 md:p-5 flex flex-row md:flex-col justify-end items-center gap-2 md:border-l border-t md:border-t-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              View Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  subvalue?: string;
  trend?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, subvalue, trend }) => {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`font-medium ${trend || ""}`}>{value}</div>
      {subvalue && <div className="text-xs text-muted-foreground">{subvalue}</div>}
    </div>
  );
};

export default ActiveCampaigns;
