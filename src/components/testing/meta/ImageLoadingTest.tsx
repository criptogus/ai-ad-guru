
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="testImageUrl">Test Image URL</Label>
          <Input
            id="testImageUrl"
            value={debugImageUrl}
            onChange={(e) => setDebugImageUrl(e.target.value)}
            placeholder="Enter image URL to test loading"
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={() => handleTestImageLoad(debugImageUrl)}
            disabled={!debugImageUrl}
            className="w-full"
          >
            Test Image Load
          </Button>
        </div>
      </div>
      
      {debugImageUrl && (
        <div className="border p-4 rounded-md">
          <h4 className="text-sm font-medium mb-2">Image Loading Test Results</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={debugImageUrl}
                alt="Test"
                className="w-full h-auto"
                onLoad={() => setDebugImageLoaded(true)}
                onError={() => setDebugImageError(true)}
              />
            </div>
            <div className="col-span-3">
              <p className="text-sm mb-2">
                <span className="font-medium">Status:</span>{" "}
                {debugImageLoaded && !debugImageError ? (
                  <span className="text-green-500">Loaded successfully</span>
                ) : debugImageError ? (
                  <span className="text-red-500">Failed to load</span>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">URL:</span>{" "}
                <span className="font-mono text-xs break-all">{debugImageUrl}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This tool helps debug image loading issues by testing if a URL can be loaded as an image.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoadingTest;
