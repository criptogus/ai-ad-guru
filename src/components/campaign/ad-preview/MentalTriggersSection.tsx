
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
    <div className="space-y-2">
      <CardTitle className="text-lg font-semibold">Mental Triggers</CardTitle>
      <CardDescription>
        Use psychological triggers to make your ad copy more engaging
      </CardDescription>
      <div className="mt-4">
        <InsertTriggerButton onSelectTrigger={onSelectTrigger} />
      </div>
    </div>
  );
};

export default MentalTriggersSection;
