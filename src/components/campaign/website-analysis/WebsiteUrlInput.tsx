
import React from "react";
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
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
            type="url"
            placeholder="https://your-website.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
            className="pr-10 bg-background"
            disabled={isAnalyzing}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!website || isAnalyzing}
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
      <p className="text-xs text-muted-foreground mt-1">
        Enter your website URL so we can analyze it and suggest optimal ad campaign settings
      </p>
    </form>
  );
};

export default WebsiteUrlInput;
