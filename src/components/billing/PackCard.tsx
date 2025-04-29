
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface PackCardProps {
  title: string;
  description: string;
  price: number;
  perCredit: string;
  features: string[];
  onClick: () => void;
  isProcessing: boolean;
  processingPack: string | null;
  packId: string;
  highlight?: boolean;
}

const PackCard: React.FC<PackCardProps> = ({
  title,
  description,
  price,
  perCredit,
  features,
  onClick,
  isProcessing,
  processingPack,
  packId,
  highlight = false
}) => {
  return (
    <Card className={`relative border-2 ${highlight ? "border-primary" : "hover:border-primary/50"}`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-3 rounded-full">
          MOST POPULAR
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">${price}</div>
        <div className="text-sm text-muted-foreground">{perCredit}</div>
        <ul className="space-y-2 mt-4 text-sm">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center">
              <Plus className="mr-2 h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full mt-4"
          onClick={onClick}
          disabled={isProcessing}
        >
          {isProcessing && processingPack === packId ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Buy Credits
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackCard;
