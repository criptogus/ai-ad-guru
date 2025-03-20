
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Clock, Hash, PenLine } from "lucide-react";

interface AdDetailsSectionProps {
  ad: MetaAd;
  onUpdate: (updatedAd: MetaAd) => void;
  isEditing?: boolean;
}

const AdDetailsSection: React.FC<AdDetailsSectionProps> = ({ 
  ad, 
  onUpdate,
  isEditing = false 
}) => {
  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...ad,
      headline: e.target.value
    });
  };

  const handlePrimaryTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...ad,
      primaryText: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...ad,
      description: e.target.value
    });
  };

  const handleImagePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...ad,
      imagePrompt: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`headline-${ad.headline}`} className="flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5 text-blue-500" />
          Headline
        </Label>
        {isEditing ? (
          <Input 
            id={`headline-${ad.headline}`}
            value={ad.headline}
            onChange={handleHeadlineChange}
            maxLength={150}
            placeholder="Enter ad headline"
            className="transition-all duration-200"
          />
        ) : (
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-sm">
            {ad.headline}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`primaryText-${ad.headline}`} className="flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5 text-blue-500" />
          Primary Text
        </Label>
        {isEditing ? (
          <Textarea 
            id={`primaryText-${ad.headline}`}
            value={ad.primaryText}
            onChange={handlePrimaryTextChange}
            maxLength={600}
            placeholder="Enter primary ad text"
            rows={4}
            className="transition-all duration-200"
          />
        ) : (
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-sm">
            {ad.primaryText}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`description-${ad.headline}`} className="flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5 text-blue-500" />
          Description/CTA
        </Label>
        {isEditing ? (
          <Input 
            id={`description-${ad.headline}`}
            value={ad.description}
            onChange={handleDescriptionChange}
            maxLength={150}
            placeholder="Enter ad description/CTA"
            className="transition-all duration-200"
          />
        ) : (
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-sm">
            {ad.description}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`imagePrompt-${ad.headline}`} className="flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5 text-blue-500" />
          Image Prompt
        </Label>
        {isEditing ? (
          <Textarea 
            id={`imagePrompt-${ad.headline}`}
            value={ad.imagePrompt}
            onChange={handleImagePromptChange}
            placeholder="Enter image generation prompt"
            rows={3}
            className="transition-all duration-200"
          />
        ) : (
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-sm">
            {ad.imagePrompt}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
        <div className="flex flex-col space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />
            <span className="font-medium">Ad ID:</span> 
            <span className="font-mono">{ad.headline?.substring(0, 8) || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> 
            <span className="font-medium">Last modified:</span> 
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsSection;
