
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EmptyAdsStateProps {
  title: string;
  description: string;
  buttonText: string;
  isLoading: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({
  title,
  description,
  buttonText,
  isLoading,
  onClick,
  icon
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center space-y-3">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
          <Button
            onClick={onClick}
            disabled={isLoading}
            className="mt-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyAdsState;
