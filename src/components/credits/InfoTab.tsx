
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Image, BarChart3, Megaphone, Rocket } from "lucide-react";

const InfoTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* How credits work section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            How Credits Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Credits power AI-driven features in our platform. Each action consumes a specific 
            number of credits based on the computational resources and AI models used.
          </p>
          <p>
            Credits never expire, so you can use them at your own pace. You can always check your 
            remaining balance at the top of your dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Credit costs by feature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="mr-2 h-5 w-5 text-primary" />
            Ad Creation Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Google Search Ads (5 text variations):</strong> 5 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your website and generates 5 different ad variations with
              headlines, descriptions, and extensions optimized for maximum CTR.
            </p>
          </div>
          
          <p>
            <strong>Meta/Instagram Ads (image + caption):</strong> 5 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              AI generates a high-quality Instagram ad image based on your product and 
              brand, along with caption copy that drives engagement.
            </p>
          </div>
          
          <p>
            <strong>LinkedIn Ads:</strong> 7 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Professional ad copy tailored for B2B audiences, with specialized targeting recommendations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-5 w-5 text-primary" />
            Image Generation Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Standard Image Generation:</strong> 3 credits per image
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Uses DALL·E 3 to create high-quality ad images based on your product and brand.
            </p>
          </div>
          
          <p>
            <strong>Smart Banner Generation:</strong> 5 credits per banner
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Creates ready-to-use banner ads in multiple sizes with your branding and messaging.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="mr-2 h-5 w-5 text-primary" />
            AI Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Daily Optimization:</strong> 10 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              AI analyzes your ad performance every 24 hours, pauses low-performing ads,
              and suggests new variations based on what's working.
            </p>
          </div>
          
          <p>
            <strong>Weekly Optimization:</strong> 7 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Weekly analysis and optimization of your campaigns.
            </p>
          </div>
          
          <p>
            <strong>Monthly Optimization:</strong> 5 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Monthly analysis and optimization of your campaigns.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Analysis & Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Campaign Analysis:</strong> 2 credits
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              In-depth analysis of your campaign performance with AI-generated insights.
            </p>
          </div>
          
          <p>
            <strong>Website Analysis:</strong> 1 credit
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              AI analyzes your website to extract key information for ad creation.
            </p>
          </div>
          
          <p>
            <strong>Export Report:</strong> 1 credit
          </p>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground">
              Export detailed reports in various formats (PDF, CSV, etc.).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoTab;
