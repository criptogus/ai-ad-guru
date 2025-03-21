
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdActionsProps {
  onCreateABTest: () => void;
  onCopyAd: () => void;
}

export const AdActions: React.FC<AdActionsProps> = ({ onCreateABTest, onCopyAd }) => {
  return (
    <div className="flex space-x-2">
      <Button size="sm" onClick={onCreateABTest} className="flex-1">
        Create A/B Test
      </Button>
      <Button size="sm" variant="outline" onClick={onCopyAd} className="flex items-center">
        <Copy className="h-4 w-4 mr-1" />
        Copy
      </Button>
    </div>
  );
};
