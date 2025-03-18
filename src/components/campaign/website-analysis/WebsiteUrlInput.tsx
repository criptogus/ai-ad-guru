
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

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
  return (
    <div className="space-y-2">
      <Label htmlFor="website">Website URL</Label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="website"
            placeholder="https://example.com"
            className="pl-10"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
        <Button 
          onClick={onAnalyze} 
          disabled={isAnalyzing || !website}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </div>
  );
};

export default WebsiteUrlInput;
