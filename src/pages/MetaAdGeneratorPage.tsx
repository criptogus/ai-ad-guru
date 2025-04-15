
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SafeAppLayout from '@/components/SafeAppLayout';
import MetaAdImageGenerator from '@/components/meta-ads/MetaAdImageGenerator';
import { CreditDisplay } from '@/components/credits/CreditDisplay';
import { ImageIcon } from 'lucide-react';

const MetaAdGeneratorPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="tools">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ImageIcon className="mr-2 h-6 w-6" />
              Meta Ads Image Generator
            </h1>
            <p className="text-muted-foreground">
              Create professional ad images for Facebook and Instagram using AI
            </p>
          </div>
          <CreditDisplay className="mt-2 sm:mt-0" />
        </div>
        
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Image Generator</CardTitle>
              <CardDescription>
                Create high-quality images for your Meta Ads using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-6 p-3 bg-muted/30 rounded-md">
                <p className="font-medium text-foreground mb-2">Credit Usage:</p>
                <ul className="list-disc list-inside">
                  <li>Each image generation costs <strong>5 credits</strong></li>
                  <li>The generated image is optimized for Meta Ads (Facebook & Instagram)</li>
                  <li>You can customize the format, style, and other parameters to get the perfect image</li>
                </ul>
              </div>
              
              <MetaAdImageGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default MetaAdGeneratorPage;
