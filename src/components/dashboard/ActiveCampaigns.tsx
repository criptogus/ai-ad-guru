
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
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium flex items-center">
          <Flag className="h-5 w-5 mr-2 text-blue-600" />
          Active Campaigns
        </h2>
        <Button variant="ghost" size="sm" onClick={() => navigate("/campaigns")}>
          View All
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      <CardContent className="p-0">
        {activeCampaigns.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No active campaigns</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Get started by creating your first campaign to reach your audience.
              </p>
              <Button onClick={() => navigate("/create-campaign")} className="gap-2">
                <PlusCircle size={18} />
                Create Campaign
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {activeCampaigns.map((campaign) => (
              <CampaignItem key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CampaignItemProps {
  campaign: Campaign;
}

const CampaignItem: React.FC<CampaignItemProps> = ({ campaign }) => {
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

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-3 md:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{campaign.name}</h3>
            <Badge className={getPlatformBadge()} variant="outline">
              {campaign.platform === "google" ? "Google" : "Meta"}
            </Badge>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
              {campaign.status}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Budget: ${campaign.budget} {campaign.budgetType} • Impressions: {campaign.performance?.impressions.toLocaleString() || "0"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            View
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
    </div>
  );
};

export default ActiveCampaigns;
