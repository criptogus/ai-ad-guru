
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Search, CheckCircle, Edit } from "lucide-react";
import GoogleAdCard from "@/components/campaign/ad-preview/google/GoogleAdCard";
import InstagramPreview from "@/components/campaign/ad-preview/meta/instagram-preview/InstagramPreview";

interface ReviewAdsProps {
  ads: Record<string, any[]>;
  onApprove: (ads: Record<string, any[]>) => void;
  onBack: () => void;
}

export const ReviewAds = ({ ads, onApprove, onBack }: ReviewAdsProps) => {
  const [reviewedAds, setReviewedAds] = useState<Record<string, any[]>>(ads);
  const [approvedStatus, setApprovedStatus] = useState<Record<string, boolean[]>>({});
  const [activeTab, setActiveTab] = useState<string>(Object.keys(ads)[0] || "google");

  // Initialize approval status
  React.useEffect(() => {
    const initialStatus: Record<string, boolean[]> = {};
    
    Object.keys(ads).forEach(platform => {
      initialStatus[platform] = Array(ads[platform].length).fill(false);
    });
    
    setApprovedStatus(initialStatus);
  }, [ads]);

  const handleUpdate = (platform: string, index: number, updatedAd: any) => {
    const updated = [...reviewedAds[platform]];
    updated[index] = updatedAd;
    setReviewedAds(prev => ({ ...prev, [platform]: updated }));
  };

  const toggleApproval = (platform: string, index: number) => {
    const updated = [...(approvedStatus[platform] || [])];
    updated[index] = !updated[index];
    setApprovedStatus(prev => ({ ...prev, [platform]: updated }));
  };

  const isAllApproved = () => {
    return Object.keys(approvedStatus).every(platform => 
      approvedStatus[platform]?.every(status => status)
    );
  };

  const handleApproveAll = () => {
    const newApprovedStatus: Record<string, boolean[]> = {};
    
    Object.keys(reviewedAds).forEach(platform => {
      newApprovedStatus[platform] = Array(reviewedAds[platform].length).fill(true);
    });
    
    setApprovedStatus(newApprovedStatus);
  };

  const handleSubmit = () => {
    // Filter only approved ads
    const approved: Record<string, any[]> = {};
    
    Object.keys(reviewedAds).forEach(platform => {
      approved[platform] = reviewedAds[platform].filter((_, index) => 
        approvedStatus[platform]?.[index]
      );
    });
    
    onApprove(approved);
  };

  // Get available platforms that have ads
  const platforms = Object.keys(ads).filter(p => ads[p]?.length > 0);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Revisar Anúncios</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          {platforms.map(platform => (
            <TabsTrigger key={platform} value={platform} className="capitalize">
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {platforms.map(platform => (
          <TabsContent key={platform} value={platform} className="space-y-4">
            {reviewedAds[platform]?.map((ad, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 bg-muted flex justify-between items-center">
                    <h3 className="font-medium">Anúncio {index + 1}</h3>
                    <Toggle 
                      pressed={approvedStatus[platform]?.[index]} 
                      onPressedChange={() => toggleApproval(platform, index)}
                      aria-label="Aprovar anúncio"
                    >
                      {approvedStatus[platform]?.[index] ? 
                        <CheckCircle className="h-4 w-4 mr-2" /> : 
                        <Edit className="h-4 w-4 mr-2" />
                      }
                      {approvedStatus[platform]?.[index] ? "Aprovado" : "Aprovar"}
                    </Toggle>
                  </div>
                  
                  <div className="p-4">
                    {/* Preview based on platform */}
                    {platform === "google" && (
                      <GoogleAdCard ad={ad} />
                    )}
                    {platform === "meta" && (
                      <InstagramPreview
                        ad={ad}
                      />
                    )}
                    {/* For other platforms, show JSON data */}
                    {!["google", "meta"].includes(platform) && (
                      <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-60">
                        {JSON.stringify(ad, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleApproveAll}
            disabled={isAllApproved()}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar todos
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={!Object.values(approvedStatus).some(statuses => 
              statuses?.some(status => status)
            )}
          >
            Prosseguir para publicação
          </Button>
        </div>
      </div>
    </Card>
  );
};
