
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GoogleAd, MetaAd } from "@/hooks/useAdGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Check, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  isGenerating: boolean;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onNext: () => void;
}

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  isGenerating,
  onGenerateGoogleAds,
  onGenerateMetaAds,
  onGenerateImage,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState("google");
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  const handleImageGeneration = async (ad: MetaAd, index: number) => {
    setLoadingImageIndex(index);
    await onGenerateImage(ad, index);
    setLoadingImageIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Previews</CardTitle>
        <CardDescription>
          Preview and select AI-generated ads for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs 
          defaultValue="google" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Meta/Instagram Ads</TabsTrigger>
          </TabsList>
          
          {/* Google Ads Content */}
          <TabsContent value="google" className="pt-4 space-y-4">
            {googleAds.length === 0 ? (
              <div className="text-center p-6 bg-muted/30 rounded-md">
                <h3 className="font-medium mb-2">Generate Google Search Ads</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will create high-converting Google Search ads based on your website analysis.
                </p>
                <Button 
                  onClick={onGenerateGoogleAds} 
                  disabled={isGenerating}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Google Ads"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {googleAds.map((ad, index) => (
                  <div key={index} className="border rounded-md p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Google Ad Variation {index + 1}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(`${ad.headlines.join(" | ")}\n\n${ad.descriptions.join("\n")}`)}
                      >
                        <Copy size={16} className="mr-1" /> Copy
                      </Button>
                    </div>
                    
                    {/* Google Ad Preview */}
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <div className="text-xs text-gray-500 mb-1">www.{analysisResult.companyName.toLowerCase().replace(/\s+/g, "-")}.com</div>
                      <div className="text-blue-800 font-medium text-xl leading-tight">
                        {ad.headlines.map((headline, i) => (
                          <span key={i}>
                            {headline}
                            {i < ad.headlines.length - 1 && <span className="text-gray-400"> | </span>}
                          </span>
                        ))}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {ad.descriptions.map((desc, i) => (
                          <div key={i}>{desc}</div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Ad Details */}
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Headlines:</span>
                        <ul className="list-disc list-inside pl-2">
                          {ad.headlines.map((headline, i) => (
                            <li key={i}>{headline}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Descriptions:</span>
                        <ul className="list-disc list-inside pl-2">
                          {ad.descriptions.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Meta/Instagram Ads Content */}
          <TabsContent value="meta" className="pt-4 space-y-4">
            {metaAds.length === 0 ? (
              <div className="text-center p-6 bg-muted/30 rounded-md">
                <h3 className="font-medium mb-2">Generate Meta/Instagram Ads</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will create engaging Meta/Instagram ads with captions and generated images.
                </p>
                <Button 
                  onClick={onGenerateMetaAds} 
                  disabled={isGenerating}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Meta Ads"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {metaAds.map((ad, index) => (
                  <div key={index} className="border rounded-md p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Meta/Instagram Ad Variation {index + 1}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.primaryText}\n\n${ad.description}`)}
                      >
                        <Copy size={16} className="mr-1" /> Copy
                      </Button>
                    </div>
                    
                    {/* Instagram Ad Preview */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="font-medium text-gray-800 mb-1">{analysisResult.companyName}</div>
                          <p className="text-sm mb-2">{ad.primaryText}</p>
                          <div className="font-medium text-sm">{ad.headline}</div>
                          <div className="text-xs text-gray-600">{ad.description}</div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-48 flex-shrink-0">
                        {ad.imageUrl ? (
                          <div className="relative bg-gray-100 rounded-md overflow-hidden aspect-square">
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.headline} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-md h-full flex flex-col items-center justify-center p-4 aspect-square">
                            <p className="text-sm text-gray-500 text-center mb-2">AI image can be generated based on ad content</p>
                            <Button 
                              size="sm" 
                              onClick={() => handleImageGeneration(ad, index)}
                              disabled={loadingImageIndex !== null}
                            >
                              {loadingImageIndex === index ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Generate Image"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ad Details */}
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Primary Text:</span>
                        <p className="pl-2">{ad.primaryText}</p>
                      </div>
                      <div>
                        <span className="font-medium">Headline:</span>
                        <p className="pl-2">{ad.headline}</p>
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="pl-2">{ad.description}</p>
                      </div>
                      <div>
                        <span className="font-medium">Image Prompt:</span>
                        <p className="pl-2 text-xs text-gray-600">{ad.imagePrompt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button variant="outline">
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={
              (activeTab === "google" && googleAds.length === 0) || 
              (activeTab === "meta" && metaAds.length === 0)
            }
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;
