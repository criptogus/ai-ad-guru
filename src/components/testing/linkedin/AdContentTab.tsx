
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AdContentTabProps {
  testAd: MetaAd;
  onAdChange: (field: keyof MetaAd, value: string) => void;
}

const AdContentTab: React.FC<AdContentTabProps> = ({ testAd, onAdChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input 
          id="headline" 
          value={testAd.headline || ''} 
          onChange={(e) => onAdChange('headline', e.target.value)}
          placeholder="e.g., Accelerate Your Business Growth"
        />
      </div>
      
      <div>
        <Label htmlFor="primaryText">Primary Text</Label>
        <Textarea 
          id="primaryText" 
          value={testAd.primaryText || ''}
          onChange={(e) => onAdChange('primaryText', e.target.value)}
          placeholder="e.g., Discover how our solution can transform your business operations..."
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description / CTA</Label>
        <Input 
          id="description" 
          value={testAd.description || ''} 
          onChange={(e) => onAdChange('description', e.target.value)}
          placeholder="e.g., Learn More | Contact Us | Schedule Demo"
        />
      </div>
    </div>
  );
};

export default AdContentTab;
