
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
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <CardTitle className="text-lg font-semibold">Mental Triggers</CardTitle>
        <CardDescription>
          Use psychological triggers to make your ad copy more engaging
        </CardDescription>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <InsertTriggerButton 
          onSelectTrigger={onSelectTrigger} 
          buttonVariant="outline"
          className="w-full"
        >
          Browse Triggers
        </InsertTriggerButton>
      </div>
    </div>
  );
};

export default MentalTriggersSection;
