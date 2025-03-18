
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/models/CampaignTypes";

interface ActiveCampaignsProps {
  campaigns: Campaign[];
}

const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  // Get active campaigns
  const activeCampaigns = campaigns.filter(campaign => 
    campaign.status === 'active');

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Active Campaigns</h2>
      {activeCampaigns.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No active campaigns</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first campaign.
              </p>
              <Button onClick={() => navigate("/create-campaign")}>
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>
                      {campaign.platform === "google" ? "Google Search" : "Meta"}
                    </CardDescription>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    Active
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${campaign.budget}/{campaign.budgetType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impressions</span>
                    <span className="font-medium">{campaign.performance?.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CTR</span>
                    <span className="font-medium">{((campaign.performance?.ctr || 0) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spend</span>
                    <span className="font-medium">${campaign.performance?.spend.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveCampaigns;
