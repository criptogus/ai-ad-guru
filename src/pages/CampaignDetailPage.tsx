
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft, CalendarIcon, Clock, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InstagramPreview } from '@/components/campaign/ad-preview/meta';
import AdPreviewSwitcher from '@/components/campaign/ad-preview/AdPreviewSwitcher';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  budget_type: string;
  objective: string;
  platforms: string[];
  target_audience: string;
  website_url: string;
  meta_ads?: MetaAd[];
  google_ads?: GoogleAd[];
  linkedin_ads?: MetaAd[];
  microsoft_ads?: GoogleAd[];
  analysis_result?: WebsiteAnalysisResult;
}

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        
        // This is a mock implementation
        // In a real app, fetch the campaign from your API or database
        // For now, we'll create a mock campaign
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCampaign: Campaign = {
          id: id || '1',
          name: 'Summer Sale Campaign',
          status: 'active',
          start_date: '2025-04-15',
          end_date: '2025-05-15',
          budget: 1000,
          budget_type: 'total',
          objective: 'conversions',
          platforms: ['meta', 'google'],
          target_audience: 'Adults 25-45 interested in fashion',
          website_url: 'https://example.com',
          meta_ads: [
            {
              headline: 'Summer Sale - Up to 50% Off',
              primaryText: 'Refresh your wardrobe with our latest summer collection. Limited time offer with free shipping on all orders over $50! 🔥 #SummerStyle',
              description: 'Shop Now',
              imageUrl: 'https://svnockyhgohttzgbgydo.supabase.co/storage/meta-ad-images/meta-ad-1681570810123-abc123.png',
              imagePrompt: 'Summer fashion items arranged stylishly on a beach setting with bright sunlight'
            },
            {
              headline: 'New Summer Collection',
              primaryText: 'Discover the hottest trends for summer 2025. Vibrant colors, comfortable fabrics, perfect for beach days and summer nights! ✨ #NewCollection',
              description: 'Explore Now',
              imagePrompt: 'Models wearing colorful summer clothes standing on a beachfront with palm trees'
            }
          ],
          google_ads: [
            {
              headline1: 'Summer Sale Up to 50% Off',
              headline2: 'Free Shipping on Orders $50+',
              headline3: 'Shop Our New Collection Today',
              description1: 'Refresh your summer wardrobe with our latest styles and trends.',
              description2: 'Limited time offer. Quality guaranteed. Fast delivery available.',
              headlines: ['Summer Sale Up to 50% Off', 'Free Shipping on Orders $50+', 'Shop Our New Collection Today'],
              descriptions: [
                'Refresh your summer wardrobe with our latest styles and trends.',
                'Limited time offer. Quality guaranteed. Fast delivery available.'
              ],
              path1: 'summer',
              path2: 'sale',
              siteLinks: []
            }
          ],
          analysis_result: {
            websiteUrl: 'https://example.com',
            companyName: 'Fashion Store',
            businessDescription: 'A modern fashion retailer offering stylish, affordable clothing for all occasions.',
            keywords: ['fashion', 'clothing', 'summer', 'style', 'affordable'],
            targetAudience: 'Fashion-conscious adults aged 25-45',
            uniqueSellingPoints: ['Sustainable manufacturing', 'Wide size range', 'Ethical sourcing'],
            callToAction: ['Shop Now', 'View Collection'],
            brandTone: 'Modern, energetic, trendy'
          }
        };
        
        setCampaign(mockCampaign);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Failed to load campaign details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <AppLayout activePage="campaigns">
        <div className="container p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !campaign) {
    return (
      <AppLayout activePage="campaigns">
        <div className="container p-6">
          <Link to="/campaigns" className="flex items-center text-sm mb-6 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to campaigns
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Campaign not found'}
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  // Create a fallback analysis result that meets the WebsiteAnalysisResult interface requirements
  const fallbackAnalysis: WebsiteAnalysisResult = {
    companyName: campaign.analysis_result?.companyName || 'Your Company',
    websiteUrl: campaign.website_url,
    businessDescription: campaign.analysis_result?.businessDescription || '',
    targetAudience: campaign.analysis_result?.targetAudience || '',
    brandTone: campaign.analysis_result?.brandTone || '',
    keywords: campaign.analysis_result?.keywords || [],
    callToAction: campaign.analysis_result?.callToAction || [],
    uniqueSellingPoints: campaign.analysis_result?.uniqueSellingPoints || []
  };

  return (
    <AppLayout activePage="campaigns">
      <div className="container p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <Link to="/campaigns" className="flex items-center text-sm mb-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to campaigns
            </Link>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="flex items-center mt-1">
              <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">ID: {campaign.id}</span>
            </div>
          </div>
          
          <div className="flex mt-4 sm:mt-0 gap-2">
            <Button variant="outline" size="sm">
              Edit Campaign
            </Button>
            <Button variant="outline" size="sm">
              Pause Campaign
            </Button>
            <Button size="sm">
              View Analytics
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-2xl font-bold">${campaign.budget}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 capitalize">{campaign.budget_type} budget</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold">30 days</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Platforms</p>
                      <p className="text-2xl font-bold">{campaign.platforms.length}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {campaign.platforms.includes('meta') && (
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          F
                        </div>
                      )}
                      {campaign.platforms.includes('google') && (
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                          G
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {campaign.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Objective</p>
                      <p className="text-2xl font-bold capitalize">{campaign.objective}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Target: {campaign.target_audience}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <AdPreviewSwitcher 
                  analysisResult={fallbackAnalysis}
                  googleAd={campaign.google_ads?.[0]}
                  metaAd={campaign.meta_ads?.[0]}
                  initialTab={campaign.platforms[0] || 'meta'}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ads" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Campaign Ads</h2>
              <Button variant="outline" size="sm">
                Create New Ad
              </Button>
            </div>
            
            <Separator />
            
            {campaign.meta_ads && campaign.meta_ads.length > 0 && (
              <>
                <h3 className="text-md font-medium">Instagram/Facebook Ads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaign.meta_ads.map((ad, index) => (
                    <Card key={`meta-ad-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-center mb-4">
                          <InstagramPreview 
                            ad={ad} 
                            companyName={campaign.analysis_result?.companyName || 'Your Company'}
                          />
                        </div>
                        <div className="space-y-2 mt-4">
                          <div>
                            <p className="text-sm font-medium">Headline</p>
                            <p className="text-sm">{ad.headline}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Primary Text</p>
                            <p className="text-sm">{ad.primaryText}</p>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Duplicate</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
            
            {campaign.google_ads && campaign.google_ads.length > 0 && (
              <>
                <h3 className="text-md font-medium mt-6">Google Ads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaign.google_ads.map((ad, index) => (
                    <Card key={`google-ad-${index}`}>
                      <CardContent className="p-4">
                        <p className="font-medium">{ad.headline1}</p>
                        <p className="text-sm text-primary">{campaign.website_url}</p>
                        <p className="text-sm">{ad.description1}</p>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Duplicate</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics data will be available after the campaign has been running for at least 24 hours.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Campaign Name</p>
                    <p>{campaign.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p>${campaign.budget} ({campaign.budget_type})</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Timeline</p>
                    <p>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Objective</p>
                    <p className="capitalize">{campaign.objective}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Target Audience</p>
                    <p>{campaign.target_audience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Website URL</p>
                    <p>{campaign.website_url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CampaignDetailPage;
