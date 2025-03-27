
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Chrome, Linkedin, Instagram, Target } from "lucide-react";
import { useCampaign } from "@/contexts/CampaignContext";

interface PlatformSelectionStepProps {
  onNext: (data?: { platforms: string[] }) => void;
  onBack: () => void;
}

const PlatformSelectionStep: React.FC<PlatformSelectionStepProps> = ({
  onNext,
  onBack,
}) => {
  const { campaignData } = useCampaign();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaignData.platforms || []);

  const platforms = [
    {
      id: "google",
      name: "Google Ads",
      description: "Text and display ads shown on Google Search and Partner sites",
      icon: <Chrome className="h-5 w-5 text-red-500" />,
      creditCost: 5,
    },
    {
      id: "microsoft",
      name: "Microsoft Ads (Bing)",
      description: "Search ads for Bing, Yahoo, and Microsoft partners",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      creditCost: 5,
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      description: "Professional B2B targeting for the LinkedIn network",
      icon: <Linkedin className="h-5 w-5 text-blue-700" />,
      creditCost: 5,
    },
    {
      id: "meta",
      name: "Instagram (Meta Ads)",
      description: "Visual ads for Instagram and Facebook platforms",
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
      creditCost: 5,
    },
  ];

  // Initialize with existing selection
  useEffect(() => {
    if (campaignData.platforms && campaignData.platforms.length > 0) {
      setSelectedPlatforms(campaignData.platforms);
    }
  }, [campaignData.platforms]);

  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const handleNextClick = () => {
    onNext({ platforms: selectedPlatforms });
  };

  const showWarning = selectedPlatforms.length === 0;
  const totalCreditCost = selectedPlatforms.reduce((total, platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return total + (platform?.creditCost || 0);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Ad Platforms</CardTitle>
        <CardDescription>
          Select which platforms you want to create ads for with this campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <div className="flex-1 flex items-start gap-3">
                  <div className={`rounded-full p-2 ${selectedPlatforms.includes(platform.id) ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <div className="font-medium">{platform.name}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {platform.description}
                    </p>
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      {platform.creditCost} credits per campaign
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showWarning && (
            <Alert variant="destructive" className="bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select at least one platform to continue
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Selected platforms will cost {totalCreditCost} credits total.</strong> You'll receive AI-generated ads with professionally crafted copy and visuals optimized for each platform.
            </p>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              onClick={handleNextClick}
              disabled={showWarning}
            >
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformSelectionStep;
