
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName?: string;
  className?: string;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName = "Your Company",
  className
}) => {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Improved error handling with inline SVG fallback
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error("Failed to load Instagram ad image:", ad.imageUrl);
  };

  // Format primaryText to handle hashtags
  const formatPrimaryText = () => {
    if (!ad.primaryText) return null;
    
    const parts = ad.primaryText.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return <span key={index} className="text-blue-500">{part}</span>;
      }
      return part;
    });
  };

  // SVG placeholder for error state
  const errorPlaceholder = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#f5f5f5"/>
      <text x="50" y="50" font-family="Arial" font-size="8" fill="#9ca3af" text-anchor="middle">Image unavailable</text>
    </svg>
  `;

  return (
    <div className={cn("w-full max-w-md border rounded-md overflow-hidden bg-white", className)}>
      {/* Instagram header with profile */}
      <div className="p-3 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mr-2 flex-shrink-0"></div>
        <div>
          <div className="text-sm font-semibold">{companyName}</div>
          <div className="text-xs text-gray-500">Sponsored</div>
        </div>
      </div>
      
      {/* Instagram image */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        
        {imageError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
            <div dangerouslySetInnerHTML={{ __html: errorPlaceholder }} className="w-16 h-16 mb-2" />
            <span className="text-sm">Image could not be loaded</span>
            <span className="text-xs mt-1 max-w-xs">{ad.imagePrompt ? `Prompt: ${ad.imagePrompt.substring(0, 50)}...` : "No prompt provided"}</span>
          </div>
        ) : (
          ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.headline || "Instagram ad"}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
              <span className="text-sm">No image generated yet</span>
            </div>
          )
        )}
      </div>
      
      {/* Instagram engagement icons */}
      <div className="p-3">
        <div className="flex space-x-4 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        
        {/* Content */}
        <div>
          <div className="font-semibold text-sm mb-1">{companyName}</div>
          <div className="text-sm whitespace-pre-wrap">
            {formatPrimaryText()}
          </div>
          {ad.headline && <div className="font-medium text-sm mt-2">{ad.headline}</div>}
          
          {/* CTA */}
          {ad.description && (
            <div className="mt-3">
              <button className="bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded-md w-full">
                {ad.description}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
