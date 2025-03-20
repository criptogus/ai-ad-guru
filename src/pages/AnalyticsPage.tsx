
import React, { useState } from "react";
import { generateMockCampaigns } from "@/models/CampaignTypes";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnalyticsPage: React.FC = () => {
  // For demonstration purposes, using mock campaigns
  // In a real app, this would come from an API or context
  const campaigns = generateMockCampaigns(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <AppLayout activePage="analytics">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium">Analytics & Optimization</h1>
            <p className="text-muted-foreground">
              AI-powered insights and campaign performance data
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <AnalyticsOverview campaigns={campaigns} />
          </TabsContent>
          
          <TabsContent value="performance">
            <CampaignPerformanceTable campaigns={campaigns} />
          </TabsContent>
          
          <TabsContent value="ai-insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Top Performing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {campaigns
                      .sort((a, b) => (b.performance?.ctr || 0) - (a.performance?.ctr || 0))
                      .slice(0, 3)
                      .map(campaign => (
                        <li key={campaign.id} className="p-3 bg-muted/30 rounded-md">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            CTR: {campaign.performance?.ctr.toFixed(2)}% | 
                            ROI: {(campaign.performance?.spend ? (campaign.performance?.clicks / campaign.performance?.spend) * 100 : 0).toFixed(2)}%
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Budget Allocation Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {campaigns
                      .sort((a, b) => (b.performance?.ctr || 0) - (a.performance?.ctr || 0))
                      .slice(0, 3)
                      .map(campaign => (
                        <li key={campaign.id} className="p-3 bg-muted/30 rounded-md">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Recommendation: Increase budget by 20% based on high CTR and conversion rate
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Campaign Performance Table Component
const CampaignPerformanceTable: React.FC<{ campaigns: any[] }> = ({ campaigns }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>{campaign.performance?.impressions.toLocaleString()}</TableCell>
                  <TableCell>{campaign.performance?.clicks.toLocaleString()}</TableCell>
                  <TableCell>{campaign.performance?.ctr.toFixed(2)}%</TableCell>
                  <TableCell>${campaign.performance?.spend.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
