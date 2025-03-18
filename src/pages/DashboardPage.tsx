
import React from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BarChart, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { generateMockCampaigns, Campaign } from "@/models/CampaignTypes";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  
  React.useEffect(() => {
    // In a real app, we would fetch campaigns from an API
    const mockCampaigns = generateMockCampaigns(3);
    setCampaigns(mockCampaigns);
  }, []);

  // Calculate dashboard stats
  const totalImpressions = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.impressions || 0), 0);
  
  const totalClicks = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.clicks || 0), 0);
  
  const avgCTR = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  const totalSpend = campaigns.reduce((total, campaign) => 
    total + (campaign.performance?.spend || 0), 0);

  // Get active campaigns
  const activeCampaigns = campaigns.filter(campaign => 
    campaign.status === 'active');

  // Calculate month-over-month growth (mock data)
  const previousMonthSpend = totalSpend * 0.8;
  const spendGrowth = ((totalSpend - previousMonthSpend) / previousMonthSpend) * 100;

  return (
    <AppLayout activePage="dashboard">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Here's what's happening with your campaigns</p>
          </div>
          <Button onClick={() => navigate("/create-campaign")} className="gap-2">
            <PlusCircle size={18} />
            <span>Create Campaign</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Impressions</CardDescription>
              <CardTitle className="text-3xl">{totalImpressions.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart size={14} className="mr-1" />
                <span>Across all campaigns</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Clicks</CardDescription>
              <CardTitle className="text-3xl">{totalClicks.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity size={14} className="mr-1" />
                <span>Engaged users</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average CTR</CardDescription>
              <CardTitle className="text-3xl">{avgCTR.toFixed(2)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                {avgCTR > 2 ? (
                  <TrendingUp size={14} className="mr-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="mr-1 text-red-500" />
                )}
                <span>Industry avg: 2.00%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Ad Spend</CardDescription>
              <CardTitle className="text-3xl">${totalSpend.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                {spendGrowth > 0 ? (
                  <TrendingUp size={14} className="mr-1 text-green-500" />
                ) : (
                  <TrendingDown size={14} className="mr-1 text-red-500" />
                )}
                <span>{Math.abs(spendGrowth).toFixed(1)}% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
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

        {/* Credits Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Credits Status</h2>
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg">Available Credits</h3>
                  <p className="text-muted-foreground">Your monthly plan includes 400 credits</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{user?.credits} credits</div>
                  <Button variant="outline" onClick={() => navigate("/billing")}>
                    <DollarSign size={16} className="mr-2" />
                    Buy More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
