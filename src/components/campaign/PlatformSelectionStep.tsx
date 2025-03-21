
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Chrome, Linkedin, Instagram, Target } from "lucide-react";

interface PlatformSelectionStepProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const PlatformSelectionStep: React.FC<PlatformSelectionStepProps> = ({
  selectedPlatforms,
  onPlatformsChange,
  onBack,
  onNext,
}) => {
  const platforms = [
    {
      id: "google",
      name: "Google Ads",
      description: "Text and display ads shown on Google Search and Partner sites",
      icon: <Chrome className="h-5 w-5 text-red-500" />,
    },
    {
      id: "microsoft",
      name: "Microsoft Ads (Bing)",
      description: "Search ads for Bing, Yahoo, and Microsoft partners",
      icon: <Target className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      description: "Professional B2B targeting for the LinkedIn network",
      icon: <Linkedin className="h-5 w-5 text-blue-700" />,
    },
    {
      id: "meta",
      name: "Instagram (Meta Ads)",
      description: "Visual ads for Instagram and Facebook platforms",
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
    },
  ];

  const handlePlatformToggle = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformsChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onPlatformsChange([...selectedPlatforms, platformId]);
    }
  };

  const showWarning = selectedPlatforms.length === 0;

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
          <div className="grid gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  id={`platform-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`platform-${platform.id}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {platform.icon}
                    <span className="font-medium">{platform.name}</span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {platform.description}
                  </p>
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
              <strong>Note:</strong> You'll only be charged credits and receive AI-generated ads for the platforms you choose.
            </p>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              onClick={onNext} 
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
