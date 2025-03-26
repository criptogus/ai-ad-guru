
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard } from "lucide-react";

interface TriggerCardProps {
  trigger: string;
  category: string;
  onSelect: () => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  category,
  onSelect,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              {category}
            </Badge>
            <p className="text-base font-medium">{trigger}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="shrink-0 flex items-center gap-1"
            onClick={onSelect}
          >
            <Clipboard className="h-3.5 w-3.5" />
            <span>Insert</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerCard;
