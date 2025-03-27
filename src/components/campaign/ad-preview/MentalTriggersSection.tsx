
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MentalTriggersSectionProps } from "@/types/campaign";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";
import { SparklesIcon } from "lucide-react";

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({
  onSelectTrigger,
  activePlatform = "google"
}) => {
  const handleSelectTrigger = (trigger: string) => {
    // Only call the callback, without any navigation logic
    if (onSelectTrigger) {
      onSelectTrigger(trigger, activePlatform);
    }
  };

  const renderPlatformName = (platform: string) => {
    switch (platform) {
      case "google":
        return "Google";
      case "meta":
        return "Instagram/Meta";
      case "linkedin":
        return "LinkedIn";
      case "microsoft":
        return "Microsoft";
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-primary" />
          Mind Triggers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add psychological triggers to your {renderPlatformName(activePlatform)} ads to make them more effective.
          </p>

          <TriggerButton
            onSelectTrigger={handleSelectTrigger}
            buttonText="Select Mind Trigger"
            tooltip="Choose psychological triggers to enhance your ad's performance"
            variant="default"
            size="default"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
