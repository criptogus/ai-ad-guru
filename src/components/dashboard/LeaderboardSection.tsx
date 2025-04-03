
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Campaign } from "@/models/CampaignTypes";

interface LeaderboardSectionProps {
  campaigns: Campaign[];
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  // Sort campaigns by performance (assuming campaigns have CTR or conversion rates)
  const sortedCampaigns = [...campaigns].sort((a, b) => b.performance - a.performance);
  const topPerforming = sortedCampaigns.slice(0, 3);
  
  // Find campaigns that need attention (low performance or budget issues)
  const needsAttention = campaigns
    .filter(campaign => campaign.performance < 0.5 || campaign.budget?.remaining < 0.2 * campaign.budget?.total)
    .slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Top Performing */}
      <Card className="h-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              <span>Top Performing</span>
            </CardTitle>
            <Button variant="link" size="sm" className="text-blue-600 p-0" onClick={() => navigate("/campaigns")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {topPerforming.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No campaigns to display</p>
          ) : (
            <div className="space-y-4">
              {topPerforming.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">{(campaign.performance * 100).toFixed(1)}%</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Needs Attention */}
      <Card className="h-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-amber-600" />
              <span>Needs Attention</span>
            </CardTitle>
            <Button variant="link" size="sm" className="text-blue-600 p-0" onClick={() => navigate("/campaigns")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {needsAttention.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">All campaigns are performing well</p>
          ) : (
            <div className="space-y-4">
              {needsAttention.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-medium">{(campaign.performance * 100).toFixed(1)}%</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardSection;
