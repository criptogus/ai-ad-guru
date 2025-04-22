import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration';
import { Button } from '@/components/ui/button';
import { Check, Edit, Smartphone, Tablet } from 'lucide-react';
import GoogleAdPreview from '../ad-preview/google/GoogleAdPreview';
import { InstagramPreview } from '../ad-preview/meta';
import { MicrosoftAdPreview } from '../ad-preview/microsoft';
import LinkedInAdPreview from '../ad-preview/linkedin/LinkedInAdPreview';
import { useToast } from '@/hooks/use-toast';

interface AdPreviewTabProps {
  selectedPlatforms: string[];
  googleAds?: GoogleAd[];
  metaAds?: MetaAd[];
  linkedInAds?: MetaAd[];
  microsoftAds?: GoogleAd[];
  isGenerating: boolean;
  onUpdateGoogleAd?: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd?: (index: number, updatedAd: MetaAd) => void;
  onUpdateLinkedInAd?: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd?: (index: number, updatedAd: GoogleAd) => void;
  onGenerateImage?: (ad: MetaAd, index: number) => Promise<void>;
  campaignData?: any;
  loadingImageIndex?: number | null;
}

const AdPreviewTab: React.FC<AdPreviewTabProps> = ({
  selectedPlatforms,
  googleAds = [],
  metaAds = [],
  linkedInAds = [],
  microsoftAds = [],
  isGenerating,
  onUpdateGoogleAd,
  onUpdateMetaAd,
  onUpdateLinkedInAd,
  onUpdateMicrosoftAd,
  onGenerateImage,
  campaignData,
  loadingImageIndex
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(selectedPlatforms[0] || 'google');
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Only keep platforms that were selected
  const filteredPlatforms = selectedPlatforms.filter(platform => 
    (platform === 'google' && googleAds?.length > 0) ||
    (platform === 'meta' && metaAds?.length > 0) ||
    (platform === 'linkedin' && linkedInAds?.length > 0) ||
    (platform === 'microsoft' && microsoftAds?.length > 0) ||
    isGenerating
  );
  
  const handleToggleEdit = (platform: string, index: number) => {
    const key = `${platform}-${index}`;
    setEditMode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleApproveAd = (platform: string, index: number) => {
    toast({
      title: "Ad Approved",
      description: `Your ${platformLabels[platform]} ad has been approved for publishing.`,
    });
    // Here you would typically mark the ad as approved in your state management
  };
  
  const platformLabels: Record<string, string> = {
    google: 'Google',
    meta: 'Instagram',
    linkedin: 'LinkedIn',
    microsoft: 'Microsoft'
  };
  
  const getDomain = (url: string = '') => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };
  
  const companyName = campaignData?.companyName || 'Your Company';
  const domain = getDomain(campaignData?.websiteUrl || '');

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted rounded-md p-1 flex space-x-1">
          <Button 
            variant={viewMode === 'desktop' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-1 h-8"
          >
            <Tablet className="h-4 w-4" />
            <span className="text-xs sm:inline hidden">Desktop</span>
          </Button>
          <Button 
            variant={viewMode === 'mobile' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-1 h-8"
          >
            <Smartphone className="h-4 w-4" />
            <span className="text-xs sm:inline hidden">Mobile</span>
          </Button>
        </div>
      </div>
      
      {filteredPlatforms.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            {filteredPlatforms.map(platform => (
              <TabsTrigger 
                key={platform} 
                value={platform}
                className="flex items-center gap-2"
              >
                {platformLabels[platform]}
                <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                  {platform === 'google' ? googleAds.length : 
                   platform === 'meta' ? metaAds.length :
                   platform === 'linkedin' ? linkedInAds.length :
                   microsoftAds.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {filteredPlatforms.map(platform => (
              <TabsContent key={platform} value={platform} className="space-y-6">
                <h3 className="text-xl font-semibold text-center mb-6">{platformLabels[platform]} Ad Previews</h3>
                
                {platform === 'google' && (
                  <>
                    {isGenerating && googleAds.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-muted-foreground">Generating Google Ads...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : googleAds.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {googleAds.map((ad, index) => (
                          <Card key={`google-${index}`} className="overflow-hidden">
                            <CardContent className={`p-0 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                              <div className="p-4 bg-muted flex justify-between items-center">
                                <h4 className="font-medium">Ad Variation {index + 1}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleEdit('google', index)}
                                  >
                                    {editMode[`google-${index}`] ? 'Cancel' : <Edit className="h-4 w-4 mr-1" />}
                                    {editMode[`google-${index}`] ? 'Cancel' : 'Edit'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleApproveAd('google', index)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6">
                                <GoogleAdPreview ad={ad} domain={domain} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">No Google Ads generated yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
                
                {platform === 'meta' && (
                  <>
                    {isGenerating && metaAds.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-muted-foreground">Generating Instagram Ads...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : metaAds.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {metaAds.map((ad, index) => (
                          <Card key={`meta-${index}`} className="overflow-hidden">
                            <CardContent className={`p-0 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                              <div className="p-4 bg-muted flex justify-between items-center">
                                <h4 className="font-medium">Ad Variation {index + 1}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleEdit('meta', index)}
                                  >
                                    {editMode[`meta-${index}`] ? 'Cancel' : <Edit className="h-4 w-4 mr-1" />}
                                    {editMode[`meta-${index}`] ? 'Cancel' : 'Edit'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleApproveAd('meta', index)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6 flex justify-center">
                                <InstagramPreview 
                                  ad={ad} 
                                  companyName={companyName}
                                  index={index}
                                  onGenerateImage={() => onGenerateImage?.(ad, index)}
                                  isLoading={loadingImageIndex === index}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">No Instagram Ads generated yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
                
                {platform === 'linkedin' && (
                  <>
                    {isGenerating && linkedInAds.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-muted-foreground">Generating LinkedIn Ads...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : linkedInAds.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {linkedInAds.map((ad, index) => (
                          <Card key={`linkedin-${index}`} className="overflow-hidden">
                            <CardContent className={`p-0 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                              <div className="p-4 bg-muted flex justify-between items-center">
                                <h4 className="font-medium">Ad Variation {index + 1}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleEdit('linkedin', index)}
                                  >
                                    {editMode[`linkedin-${index}`] ? 'Cancel' : <Edit className="h-4 w-4 mr-1" />}
                                    {editMode[`linkedin-${index}`] ? 'Cancel' : 'Edit'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleApproveAd('linkedin', index)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6 flex justify-center">
                                <LinkedInAdPreview ad={ad} analysisResult={campaignData} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">No LinkedIn Ads generated yet.</p>
                        </CardContent>
                      Card>
                    )}
                  </>
                )}
                
                {platform === 'microsoft' && (
                  <>
                    {isGenerating && microsoftAds.length === 0 ? (
                      <Card>
                        <CardContent className="p-6 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-muted-foreground">Generating Microsoft Ads...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : microsoftAds.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {microsoftAds.map((ad, index) => (
                          <Card key={`microsoft-${index}`} className="overflow-hidden">
                            <CardContent className={`p-0 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                              <div className="p-4 bg-muted flex justify-between items-center">
                                <h4 className="font-medium">Ad Variation {index + 1}</h4>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleEdit('microsoft', index)}
                                  >
                                    {editMode[`microsoft-${index}`] ? 'Cancel' : <Edit className="h-4 w-4 mr-1" />}
                                    {editMode[`microsoft-${index}`] ? 'Cancel' : 'Edit'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleApproveAd('microsoft', index)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6">
                                <MicrosoftAdPreview ad={ad} domain={domain} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">No Microsoft Ads generated yet.</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground text-center">No ad platforms selected or no ads generated yet.</p>
            {isGenerating && (
              <div className="text-center space-y-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Generating ads...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdPreviewTab;
