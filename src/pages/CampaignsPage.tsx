import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { Campaign, CampaignStatus } from "@/models/CampaignTypes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";

interface SupabaseCampaign {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  budget_type: string;
  created_at: string;
  updated_at: string;
  campaign_performance: {
    id: string;
    campaign_id: string;
    impressions: number;
    clicks: number;
    ctr: number;
    spend: number;
    date: string;
    created_at: string;
    updated_at: string;
  }[];
}

const CampaignsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, campaign_performance(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return (data as SupabaseCampaign[]).map(item => ({
        id: item.id,
        userId: item.user_id,
        name: item.name,
        platform: item.platform as 'google' | 'meta',
        status: item.status as CampaignStatus,
        budget: item.budget,
        budgetType: item.budget_type as 'daily' | 'lifetime',
        businessInfo: {
          name: '',
          description: '',
          industry: '',
          targetAudience: '',
          suggestedKeywords: [],
          adTone: '',
          websiteUrl: ''
        },
        adType: 'search',
        adVariations: [],
        performance: item.campaign_performance && item.campaign_performance.length > 0 ? {
          impressions: item.campaign_performance[0].impressions || 0,
          clicks: item.campaign_performance[0].clicks || 0,
          ctr: item.campaign_performance[0].ctr || 0,
          conversions: 0,
          costPerClick: 0,
          spend: item.campaign_performance[0].spend || 0,
          roi: 0,
          lastUpdated: item.campaign_performance[0].updated_at
        } : undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Campaign[];
    },
    enabled: !!user,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load campaigns. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <AppLayout activePage="campaigns" withSidebar={true}>
      <div className="w-full">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground">Manage your advertising campaigns</p>
            </div>
            <Button onClick={() => navigate("/create-campaign")} className="gap-2">
              <PlusCircle size={16} />
              Create Campaign
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-[220px] animate-pulse bg-muted/50"></Card>
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.platform === "google" ? "Google Search" : "Meta"}
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : campaign.status === 'draft' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">${campaign.budget}/{campaign.budgetType}</span>
                      </div>
                      {campaign.status === 'active' && campaign.performance && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Impressions</span>
                            <span className="font-medium">{campaign.performance?.impressions?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">CTR</span>
                            <span className="font-medium">{((campaign.performance?.ctr || 0) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Spend</span>
                            <span className="font-medium">${(campaign.performance?.spend || 0).toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Let AI help you create effective ad campaigns for your business.
                  </p>
                  <Button onClick={() => navigate("/create-campaign")}>
                    Create Your First Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CampaignsPage;
