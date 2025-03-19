
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageLoadingTestProps {
  debugImageUrl: string;
  setDebugImageUrl: React.Dispatch<React.SetStateAction<string>>;
  handleTestImageLoad: (url: string) => void;
  debugImageLoaded: boolean;
  debugImageError: boolean;
  setDebugImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setDebugImageError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageLoadingTest: React.FC<ImageLoadingTestProps> = ({
  debugImageUrl,
  setDebugImageUrl,
  handleTestImageLoad,
  debugImageLoaded,
  debugImageError,
  setDebugImageLoaded,
  setDebugImageError
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="imageUrl">Image URL to Test</Label>
        <div className="flex gap-2">
          <Input 
            id="imageUrl" 
            value={debugImageUrl}
            onChange={(e) => setDebugImageUrl(e.target.value)}
            placeholder="Enter image URL to test loading"
          />
          <Button onClick={() => handleTestImageLoad(debugImageUrl)}>Test</Button>
        </div>
        
        <div className="mt-4">
          <p>Status: {debugImageLoaded ? "✅ Loaded" : debugImageError ? "❌ Error" : "⏳ Not loaded yet"}</p>
          {debugImageUrl && (
            <div className="text-xs mt-2 break-all">
              <p>URL: {debugImageUrl}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-100 aspect-square relative overflow-hidden">
        {debugImageUrl ? (
          <img 
            src={debugImageUrl}
            alt="Test image"
            className="w-full h-full object-cover"
            onLoad={() => setDebugImageLoaded(true)}
            onError={() => setDebugImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Enter an image URL to test
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLoadingTest;
