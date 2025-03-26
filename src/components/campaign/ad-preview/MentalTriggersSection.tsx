
import React from "react";
import { InsertTriggerButton } from "@/components/mental-triggers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MentalTriggersSectionProps {
  onSelectTrigger: (trigger: string) => void;
}

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({
  onSelectTrigger,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Mental Triggers</CardTitle>
        <CardDescription>
          Use psychological triggers to make your ad copy more engaging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InsertTriggerButton 
            onSelectTrigger={onSelectTrigger} 
            buttonVariant="outline"
            className="w-full"
          >
            Browse Triggers
          </InsertTriggerButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
