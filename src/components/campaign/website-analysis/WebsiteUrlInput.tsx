
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

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
  const [isValid, setIsValid] = useState(false);

  // Validate URL whenever it changes
  useEffect(() => {
    validateUrl(website);
  }, [website]);

  const validateUrl = (url: string): boolean => {
    // Clear error if empty (we'll handle this separately)
    if (!url.trim()) {
      setError(null);
      setIsValid(false);
      return false;
    }

    // For validation purposes, let's add protocol if missing
    let testUrl = url.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl;
    }

    // Test if it's a valid URL
    try {
      new URL(testUrl);
      setError(null);
      setIsValid(true);
      return true;
    } catch (e) {
      setError("Please enter a valid website URL (e.g., example.com)");
      setIsValid(false);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    // Basic validation - just ensure there's some content
    if (!website.trim()) {
      setError("Please enter a website URL");
      return;
    }

    if (!isValid) {
      setError("Please enter a valid website URL (e.g., example.com)");
      return;
    }
    
    console.log("Starting website analysis for:", website);
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
            placeholder="example.com or www.example.com"
            value={website}
            onChange={(e) => handleUrlChange(e.target.value)}
            required
            className={`pr-10 bg-background ${error ? 'border-red-500' : ''}`}
            disabled={isAnalyzing}
            aria-invalid={!!error}
            aria-describedby={error ? "url-error" : undefined}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!website.trim() || isAnalyzing || !isValid}
          className="min-w-[100px]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </>
          )}
        </Button>
      </div>
      {error && (
        <p id="url-error" className="text-xs text-red-500 mt-1">{error}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Enter your website URL (with or without http://) so we can analyze it and suggest optimal ad campaign settings
      </p>
    </form>
  );
};

export default WebsiteUrlInput;
