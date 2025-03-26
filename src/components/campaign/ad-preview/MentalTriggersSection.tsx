
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Mental Triggers</CardTitle>
        <CardDescription>
          Use psychological triggers to make your ad copy more engaging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InsertTriggerButton onSelectTrigger={onSelectTrigger} />
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
