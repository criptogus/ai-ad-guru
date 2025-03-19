
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageLoader } from "@/components/campaign/ad-preview/meta/instagram-preview";
import { useAuth } from "@/contexts/AuthContext";

interface ImageLoadingTestProps {
  debugImageUrl: string;
  setDebugImageUrl: (url: string) => void;
  handleTestImageLoad: (url: string) => void;
  debugImageLoaded: boolean;
  debugImageError: boolean;
  setDebugImageLoaded: (loaded: boolean) => void;
  setDebugImageError: (error: boolean) => void;
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
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebugImageUrl(e.target.value);
  };

  const testImage = () => {
    handleTestImageLoad(debugImageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          type="text" 
          value={debugImageUrl} 
          onChange={handleInputChange} 
          placeholder="Enter image URL to test" 
          className="flex-1"
        />
        <Button onClick={testImage}>Test Load</Button>
      </div>
      
      <Card className="bg-gray-50">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-medium">Image Load Status</h3>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1">
            <p>User authenticated: {user ? "Yes" : "No"}</p>
            <p>User ID: {user ? user.id.substring(0, 8) + '...' : "Not logged in"}</p>
            <p>Image URL: {debugImageUrl || "None"}</p>
            <p>Status: {
              !debugImageUrl ? "No URL" : 
              debugImageLoaded ? "Loaded successfully" : 
              debugImageError ? "Failed to load" : 
              "Loading..."
            }</p>
          </div>
        </CardContent>
      </Card>
      
      {debugImageUrl && (
        <>
          <Separator />
          <div className="aspect-square max-w-sm mx-auto border rounded overflow-hidden">
            {debugImageUrl && (
              <ImageLoader
                imageSrc={debugImageUrl}
                altText="Test image"
                retryCount={0}
                onImageLoad={() => setDebugImageLoaded(true)}
                onImageError={() => setDebugImageError(true)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageLoadingTest;
