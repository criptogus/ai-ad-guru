
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Reset states when URL changes
  useEffect(() => {
    setDebugImageLoaded(false);
    setDebugImageError(false);
    setErrorDetails(null);
  }, [debugImageUrl, setDebugImageLoaded, setDebugImageError]);

  const handleTestImage = () => {
    if (!debugImageUrl) return;
    
    setIsLoading(true);
    setDebugImageLoaded(false);
    setDebugImageError(false);
    setErrorDetails(null);
    
    // Check if URL is valid before testing
    try {
      new URL(debugImageUrl);
    } catch (error) {
      setErrorDetails("Invalid URL format. Please enter a valid URL including http:// or https://");
      setDebugImageError(true);
      setIsLoading(false);
      return;
    }
    
    handleTestImageLoad(debugImageUrl);
    
    // Set a timeout to prevent forever loading states
    setTimeout(() => {
      setIsLoading(false);
    }, 15000);
  };
  
  const handleImageLoad = () => {
    setDebugImageLoaded(true);
    setDebugImageError(false);
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setDebugImageError(true);
    setDebugImageLoaded(false);
    setIsLoading(false);
    setErrorDetails("Image failed to load. This could be due to CORS restrictions, invalid image format, or the image doesn't exist.");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="testImageUrl">Test Image URL</Label>
          <Input
            id="testImageUrl"
            value={debugImageUrl}
            onChange={(e) => setDebugImageUrl(e.target.value)}
            placeholder="Enter image URL to test loading (https://example.com/image.jpg)"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleTestImage}
            disabled={!debugImageUrl || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Image
              </>
            )}
          </Button>
        </div>
      </div>
      
      {debugImageUrl && (
        <div className="border p-4 rounded-md">
          <h4 className="text-sm font-medium mb-2">Image Loading Test Results</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-gray-100 rounded-md overflow-hidden relative min-h-[100px] flex items-center justify-center">
              {isLoading && !debugImageLoaded && !debugImageError && (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin absolute" />
              )}
              {debugImageError && (
                <XCircle className="h-8 w-8 text-red-500 absolute" />
              )}
              <img
                src={debugImageUrl}
                alt="Test"
                className={`w-full h-auto ${debugImageError ? 'opacity-30' : debugImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: debugImageError ? 'none' : 'block' }}
              />
            </div>
            <div className="col-span-3">
              <p className="text-sm mb-2 flex items-center">
                <span className="font-medium mr-2">Status:</span>
                {isLoading && !debugImageLoaded && !debugImageError ? (
                  <span className="text-amber-500 flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Testing image loading...
                  </span>
                ) : debugImageLoaded && !debugImageError ? (
                  <span className="text-green-500 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Loaded successfully
                  </span>
                ) : debugImageError ? (
                  <span className="text-red-500 flex items-center">
                    <XCircle className="h-3 w-3 mr-1" />
                    Failed to load
                  </span>
                ) : (
                  <span className="text-gray-500">Not tested yet</span>
                )}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">URL:</span>{" "}
                <span className="font-mono text-xs break-all">{debugImageUrl}</span>
              </p>
              
              {errorDetails && (
                <Alert variant="destructive" className="mt-2 p-2">
                  <AlertDescription className="text-xs">{errorDetails}</AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-muted-foreground mt-3">
                This tool helps debug image loading issues by testing if a URL can be loaded as an image in your browser.
                Common issues include CORS restrictions, invalid image formats, or non-existent files.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoadingTest;
