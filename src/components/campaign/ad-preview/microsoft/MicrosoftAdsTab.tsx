import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration/types";
import MicrosoftAdDetails from "./MicrosoftAdDetails";
import MicrosoftAdsList from "./MicrosoftAdsList";
import EmptyAdsState from "../EmptyAdsState";
import { getDomain } from "@/lib/utils";

interface MicrosoftAdsTabProps {
  microsoftAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: GoogleAd) => void;
  mindTrigger?: string;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  microsoftAds,
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
  mindTrigger
}) => {
  const [selectedAd, setSelectedAd] = useState<GoogleAd | null>(null);

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Variations</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedAd}>
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-4">
            {microsoftAds.length === 0 ? (
              <EmptyAdsState 
                platform="microsoft"
                isGenerating={isGenerating}
                onGenerate={onGenerateAds}
              />
            ) : (
              <MicrosoftAdsList
                ads={microsoftAds}
                domain={analysisResult?.websiteUrl ? getDomain(analysisResult.websiteUrl) : 'example.com'}
                onSelectAd={setSelectedAd}
              />
            )}
          </TabsContent>
          
          <TabsContent value="details" className="p-4">
            {selectedAd ? (
              <MicrosoftAdDetails
                ad={selectedAd}
                onUpdate={onUpdateMicrosoftAd}
              />
            ) : (
              <div className="text-muted-foreground">
                Select an ad variation to view details.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdsTab;
