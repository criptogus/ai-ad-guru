
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface WebsiteUrlInputProps {
  website: string;
  setWebsite: (url: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const WebsiteUrlInput: React.FC<WebsiteUrlInputProps> = ({
  website,
  setWebsite,
  onAnalyze,
  isAnalyzing,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    // Basic validation - just ensure there's some content
    if (!website.trim()) {
      setError("Please enter a website URL");
      return;
    }
    
    onAnalyze();
  };

  // Helper function to format user input
  const handleUrlChange = (value: string) => {
    // Remove error when user starts typing
    if (error) setError(null);
    setWebsite(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="website-url" className="text-sm font-medium">
        Website URL
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            id="website-url"
            type="text"
            placeholder="www.your-website.com"
            value={website}
            onChange={(e) => handleUrlChange(e.target.value)}
            required
            className={`pr-10 bg-background ${error ? 'border-red-500' : ''}`}
            disabled={isAnalyzing}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!website.trim() || isAnalyzing}
          className="min-w-[100px]"
        >
          {isAnalyzing ? (
            "Analyzing..."
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </>
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Enter your website URL (with or without http://) so we can analyze it and suggest optimal ad campaign settings
      </p>
    </form>
  );
};

export default WebsiteUrlInput;
