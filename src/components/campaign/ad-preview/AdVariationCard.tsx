
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, RotateCw, Trash2 } from "lucide-react";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

const platformStyles = {
  google: {
    headline: "text-[#1a0dab] font-medium text-lg",
    url: "text-[#006621] text-sm",
    description: "text-[#4d5156] text-base",
    background: "bg-white",
  },
  linkedin: {
    headline: "text-[#202124] font-semibold text-lg",
    body: "text-gray-700 text-base",
    button: "bg-[#0a66c2] text-white px-4 py-2 rounded-md text-sm",
    background: "bg-[#f3f2ef]",
  },
  meta: {
    caption: "text-[#262626] text-base leading-snug",
    background: "bg-white",
  },
  bing: {
    headline: "text-[#004e8c] font-medium text-lg",
    url: "text-[#006621] text-sm",
    description: "text-gray-700 text-base",
    background: "bg-white",
  },
};

export interface AdVariationCardProps {
  platform: "google" | "linkedin" | "meta" | "bing";
  ad: GoogleAd | MetaAd | any;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function AdVariationCard({
  platform = "google",
  ad,
  onEdit,
  onRegenerate,
  onDelete,
  onCopy,
  isEditing = false,
  onSave,
  onCancel,
}: AdVariationCardProps) {
  const styles = platformStyles[platform];

  // Get domain from URL helper
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  // Render content based on platform
  const renderContent = () => {
    switch (platform) {
      case "google":
        return (
          <div className="font-['Arial'] p-4">
            <div className={styles.headline}>
              {ad.headlines?.[0]} | {ad.headlines?.[1]}
            </div>
            <div className={styles.url}>
              {getDomain(ad.finalUrl || "example.com")}
            </div>
            <div className={styles.description}>
              {ad.descriptions?.[0]}
            </div>
            {ad.descriptions?.[1] && (
              <div className={styles.description}>
                {ad.descriptions[1]}
              </div>
            )}
          </div>
        );
      
      case "bing":
        return (
          <div className="font-['Segoe UI'] p-4">
            <div className={styles.headline}>
              {ad.headlines?.[0]} | {ad.headlines?.[1]}
            </div>
            <div className={styles.url}>
              {getDomain(ad.finalUrl || "example.com")}
            </div>
            <div className={styles.description}>
              {ad.descriptions?.[0]}
            </div>
            {ad.descriptions?.[1] && (
              <div className={styles.description}>
                {ad.descriptions[1]}
              </div>
            )}
          </div>
        );
        
      case "linkedin":
        return (
          <div className="font-['Segoe UI', 'Helvetica Neue', sans-serif] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium">Company Name • Sponsored</span>
            </div>
            <div className={styles.headline}>{ad.headline}</div>
            <div className={styles.body + " my-2"}>{ad.primaryText}</div>
            <button className={styles.button}>{ad.description || "Learn More"}</button>
          </div>
        );
        
      case "meta":
        return (
          <div className="font-[system-ui] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium">
                {ad.companyName || "Your Company"} <span className="text-gray-500">• Sponsored</span>
              </span>
            </div>
            
            {ad.imageUrl ? (
              <img 
                src={ad.imageUrl} 
                alt="Ad preview" 
                className="w-full aspect-square object-cover rounded mb-3"
              />
            ) : (
              <div className="aspect-square bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            
            <div className={styles.caption}>
              <span className="font-medium mr-1">{ad.companyName || "Your Company"}</span>
              {ad.primaryText}
            </div>
            
            {ad.headline && (
              <div className="text-sm font-medium mt-1">{ad.headline}</div>
            )}
            
            <div className="mt-2">
              <span className="text-sm text-blue-600">
                {ad.description || "Learn More"}
              </span>
            </div>
          </div>
        );
        
      default:
        return <div>Unsupported platform</div>;
    }
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${styles.background}`}>
      {/* Card Header */}
      <div className="flex justify-between items-center bg-muted p-3 border-b">
        <h3 className="text-sm font-medium">
          {platform.charAt(0).toUpperCase() + platform.slice(1)} Ad Preview
        </h3>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={onSave}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              {onCopy && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCopy}
                >
                  Copy
                </Button>
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Ad Content */}
      {renderContent()}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex justify-between p-3 border-t border-gray-200">
          {onRegenerate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRegenerate}
              className="text-sm"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDelete}
              className="text-sm text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdVariationCard;
