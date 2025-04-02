
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InfoTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How Credits Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our platform uses a credit system to provide you with flexible access to AI-powered features.
            Credits are consumed when you use specific features, and different actions require different
            amounts of credits based on the computational resources they use.
          </p>
          
          <div className="bg-muted p-4 rounded-md space-y-2">
            <p className="font-medium">Key Benefits:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pay only for what you use</li>
              <li>Scale up or down based on your needs</li>
              <li>Transparent tracking of resource usage</li>
              <li>No surprise billing at the end of the month</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="creating">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creating">Creating Ads</TabsTrigger>
          <TabsTrigger value="optimizing">Optimizing</TabsTrigger>
          <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="creating" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                Creating ads with our AI uses credits based on the platform and complexity:
              </p>
              
              <div className="space-y-4">
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Google Search Ads</div>
                  <p className="text-sm text-muted-foreground">5 credits for 5 variations of headlines and descriptions.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Meta Ads with Images</div>
                  <p className="text-sm text-muted-foreground">5 credits for ad copy and caption, plus 3 credits per AI-generated image.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Smart Banners</div>
                  <p className="text-sm text-muted-foreground">5 credits per banner generated with custom dimensions and branding.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimizing" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                Our AI can optimize your campaigns automatically at different frequencies:
              </p>
              
              <div className="space-y-4">
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Daily Optimization</div>
                  <p className="text-sm text-muted-foreground">10 credits per campaign. Best for high-spend campaigns that need frequent adjustments.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Weekly Optimization</div>
                  <p className="text-sm text-muted-foreground">7 credits per campaign. Great for most businesses to maintain performance.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Monthly Optimization</div>
                  <p className="text-sm text-muted-foreground">5 credits per campaign. Good for stable campaigns with consistent performance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchasing" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                You can purchase credits in several ways:
              </p>
              
              <div className="space-y-4">
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Monthly Subscription</div>
                  <p className="text-sm text-muted-foreground">Subscribe to a plan and get a monthly allowance of credits at the best rate.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">One-time Purchases</div>
                  <p className="text-sm text-muted-foreground">Buy credit packs when you need them without a recurring commitment.</p>
                </div>
                
                <div className="border p-3 rounded-md">
                  <div className="font-medium">Credit Rollover</div>
                  <p className="text-sm text-muted-foreground">Unused credits from subscriptions roll over to the next month (up to 3x your monthly allowance).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfoTab;
