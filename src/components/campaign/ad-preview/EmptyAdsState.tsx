
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EmptyAdsStateProps {
  platform: string;
  onGenerateAds?: () => Promise<any>;
  buttonText?: string;
  isGenerating?: boolean;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({ 
  platform, 
  onGenerateAds,
  buttonText,
  isGenerating
}) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No {platform} Ads</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Click the button below to generate {platform} ads based on your website analysis
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyAdsState;
