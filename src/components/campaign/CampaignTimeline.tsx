
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, AlertCircle, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
  timeframe: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface CampaignTimelineProps {
  steps: TimelineStep[];
}

const CampaignTimeline: React.FC<CampaignTimelineProps> = ({ steps }) => {
  // Get appropriate icon for a step based on its status
  const getStepIcon = (step: TimelineStep) => {
    if (step.status === "completed") {
      return <Check className="h-5 w-5 text-white" />;
    } else if (step.status === "current") {
      return <div className="h-3 w-3 bg-blue-500 rounded-full" />;
    }
    return <div className="h-3 w-3 bg-gray-200 dark:bg-gray-600 rounded-full" />;
  };

  // Get appropriate background for step icon based on status
  const getStepIconBackground = (step: TimelineStep) => {
    if (step.status === "completed") {
      return "bg-green-600";
    } else if (step.status === "current") {
      return "bg-white border-4 border-blue-500";
    }
    return "bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-600";
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">Campaign timeline</h3>
            <p className="text-muted-foreground text-sm">
              Follow your campaign's progress over time, and refine it for best results.
            </p>
          </div>

          <div className="relative mt-8">
            {/* Timeline track */}
            <div className="absolute top-5 left-5 h-[calc(100%-20px)] w-[2px] bg-gray-200 dark:bg-gray-700 ml-[9px]" />

            {/* Timeline steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.id} className="relative pl-12">
                  {/* Step icon */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full",
                      getStepIconBackground(step)
                    )}
                  >
                    {getStepIcon(step)}
                  </div>

                  {/* Step content */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-base">{step.title}</h4>
                    <div className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                      {step.timeframe}
                    </div>
                    <p className="text-muted-foreground text-sm">{step.description}</p>

                    {/* Action button for the step if provided */}
                    {step.action && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2 text-sm"
                        onClick={step.action.onClick}
                      >
                        {step.action.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTimeline;
