
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, BarChart2, Edit, Pause, Play } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  platforms: string[];
  startDate: string;
  endDate: string;
  clicks: number;
  impressions: number;
  conversions: number;
}

const CampaignPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    // In a real app, we'd fetch this data from an API
    const fetchCampaign = async () => {
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCampaign({
          id: campaignId || '0',
          name: 'Summer 2023 Promotion',
          status: 'active',
          budget: 5000,
          spent: 1250,
          platforms: ['Google Ads', 'Meta Ads'],
          startDate: '2023-06-01',
          endDate: '2023-08-31',
          clicks: 2500,
          impressions: 150000,
          conversions: 120
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">ID: {campaignId}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm">
            {campaign.status === "active" ? (
              <><Pause className="h-4 w-4 mr-1" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-1" /> Resume</>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.spent.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ ${campaign.budget.toLocaleString()}</span></div>
            <Progress value={(campaign.spent / campaign.budget) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{((campaign.spent / campaign.budget) * 100).toFixed(1)}% of budget used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.conversions}</div>
            <p className="text-xs text-muted-foreground mt-1">Conversions</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-green-500 text-sm">↑ 12%</span>
              <span className="text-xs text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {campaign.platforms.map((platform) => (
                <div key={platform} className="flex items-center justify-between">
                  <span>{platform}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Impressions</p>
                  <p className="text-2xl font-bold">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Clicks</p>
                  <p className="text-2xl font-bold">{campaign.clicks.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">CTR</p>
                  <p className="text-2xl font-bold">
                    {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cost per Conversion</p>
                  <p className="text-2xl font-bold">
                    ${(campaign.spent / campaign.conversions).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Performance Chart
                </h3>
                <div className="h-[200px] bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Performance chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ads">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Ads</CardTitle>
              <CardDescription>
                Manage and optimize your ad creatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground pb-4">
                Your campaign ads will be displayed here.
              </p>
              
              <Button>Create New Ad</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance analytics data will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>
                Configure campaign parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Campaign settings will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignPage;
