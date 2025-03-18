
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface MetaAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
}

const MetaAdCard: React.FC<MetaAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult, 
  loadingImageIndex, 
  onGenerateImage 
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Meta/Instagram Ad Variation {index + 1}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.primaryText}\n\n${ad.description}`)}
        >
          <Copy size={16} className="mr-1" /> Copy
        </Button>
      </div>
      
      {/* Instagram Ad Preview */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium text-gray-800 mb-1">{analysisResult.companyName}</div>
            <p className="text-sm mb-2">{ad.primaryText}</p>
            <div className="font-medium text-sm">{ad.headline}</div>
            <div className="text-xs text-gray-600">{ad.description}</div>
          </div>
        </div>
        
        <div className="w-full md:w-48 flex-shrink-0">
          {ad.imageUrl ? (
            <div className="relative bg-gray-100 rounded-md overflow-hidden aspect-square">
              <img 
                src={ad.imageUrl} 
                alt={ad.headline} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-md h-full flex flex-col items-center justify-center p-4 aspect-square">
              <p className="text-sm text-gray-500 text-center mb-2">AI image can be generated based on ad content</p>
              <Button 
                size="sm" 
                onClick={() => onGenerateImage(ad, index)}
                disabled={loadingImageIndex !== null}
              >
                {loadingImageIndex === index ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Ad Details */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Primary Text:</span>
          <p className="pl-2">{ad.primaryText}</p>
        </div>
        <div>
          <span className="font-medium">Headline:</span>
          <p className="pl-2">{ad.headline}</p>
        </div>
        <div>
          <span className="font-medium">Description:</span>
          <p className="pl-2">{ad.description}</p>
        </div>
        <div>
          <span className="font-medium">Image Prompt:</span>
          <p className="pl-2 text-xs text-gray-600">{ad.imagePrompt}</p>
        </div>
      </div>
    </div>
  );
};

export default MetaAdCard;
