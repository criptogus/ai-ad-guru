import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AppLayout from "@/components/AppLayout";

const CampaignDetailPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { toast } = useToast();

  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [websiteAnalysisData, setWebsiteAnalysisData] = useState<WebsiteAnalysisResult | null>(null);

  useEffect(() => {
    // Mock API call to fetch campaign details
    const fetchCampaignDetails = async () => {
      // Simulate fetching data from an API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock campaign data
      setCampaignName("Summer Sale Campaign");
      setCampaignDescription("Promote summer sale with discounts on all products.");

      // Mock website analysis data
      setWebsiteAnalysisData({
        companyName: "Tech Solutions Inc.",
        companyDescription: "Leading provider of technology solutions for businesses",
        websiteUrl: "https://example.com/campaign",
        businessDescription: "Leading provider of technology solutions for businesses",
        targetAudience: "Small to medium-sized businesses looking for technology solutions",
        brandTone: "Professional, reliable, innovative",
        keywords: ["technology", "solutions", "business", "innovation"],
        callToAction: ["Contact us today", "Schedule a demo"],
        uniqueSellingPoints: [
          "24/7 customer support",
          "Customizable solutions",
          "Cost-effective pricing"
        ]
      });
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const handleSave = () => {
    // Mock API call to save campaign details
    // In a real application, this would send the data to your backend
    toast({
      title: "Campaign Saved",
      description: "Campaign details have been successfully saved.",
    });
  };

  const mockAnalysisResult: WebsiteAnalysisResult = {
    websiteUrl: "https://example.com/campaign",
    companyName: "Tech Solutions Inc.",
    companyDescription: "Leading provider of technology solutions for businesses",
    businessDescription: "Leading provider of technology solutions for businesses",
    keywords: ["technology", "solutions", "business", "innovation"],
    targetAudience: "Small to medium-sized businesses looking for technology solutions",
    uniqueSellingPoints: [
      "24/7 customer support",
      "Customizable solutions",
      "Cost-effective pricing"
    ],
    callToAction: ["Contact us today", "Schedule a demo"],
    brandTone: "Professional, reliable, innovative"
  };

  return (
    <AppLayout activePage="campaigns">
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Campaign Details</h1>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="campaignDescription">Campaign Description</Label>
              <Textarea
                id="campaignDescription"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {websiteAnalysisData ? (
              <>
                <div className="grid gap-4">
                  <Label>Company Name</Label>
                  <Input value={websiteAnalysisData.companyName} readOnly />
                </div>
                <div className="grid gap-4">
                  <Label>Company Description</Label>
                  <Textarea value={websiteAnalysisData.companyDescription} readOnly />
                </div>
                <div className="grid gap-4">
                  <Label>Target Audience</Label>
                  <Input value={websiteAnalysisData.targetAudience} readOnly />
                </div>
                <div className="grid gap-4">
                  <Label>Keywords</Label>
                  <Input value={websiteAnalysisData.keywords.join(", ")} readOnly />
                </div>
                <div className="grid gap-4">
                  <Label>Call to Action</Label>
                  <Input value={websiteAnalysisData.callToAction.join(", ")} readOnly />
                </div>
                <div className="grid gap-4">
                  <Label>Unique Selling Points</Label>
                  <Textarea value={websiteAnalysisData.uniqueSellingPoints.join(", ")} readOnly />
                </div>
              </>
            ) : (
              <p>No website analysis data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CampaignDetailPage;
