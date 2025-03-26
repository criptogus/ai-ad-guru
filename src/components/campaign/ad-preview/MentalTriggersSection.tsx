
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MentalTriggersSectionProps {
  onSelectTrigger: (trigger: string) => void;
}

const triggers = [
  { 
    category: "Scarcity & Urgency", 
    items: [
      "Limited Time Offer: Only available until [date]",
      "Limited Quantity: Only [X] units left",
      "Exclusive Access: Join the select few who...",
      "Act Fast: This opportunity disappears in [timeframe]",
      "Don't Miss Out: Once it's gone, it's gone for good"
    ] 
  },
  { 
    category: "Social Proof", 
    items: [
      "Join [X] satisfied customers who have already...",
      "[X]% of [target audience] have already switched to...",
      "Trusted by [well-known companies/people]",
      "See why thousands choose us every day",
      "Rated [X] stars by [number] verified customers"
    ] 
  },
  { 
    category: "Authority & Credibility", 
    items: [
      "Recommended by [industry experts]",
      "Backed by [X] years of research",
      "Certified by [relevant authority]",
      "Developed by award-winning [experts/scientists]",
      "Featured in [respected publications]"
    ] 
  },
  { 
    category: "Problem-Solution", 
    items: [
      "Struggling with [pain point]? We solved it",
      "Stop wasting time on [problem] - start [benefit]",
      "Never worry about [pain point] again",
      "Transform your [area] from [negative] to [positive]",
      "The simple solution to your [problem] challenges"
    ] 
  },
  { 
    category: "Before-After-Bridge", 
    items: [
      "Before: [pain point]. After: [solution benefit]",
      "Imagine going from [current state] to [desired state]",
      "We turned our [problem] into [solution] - you can too",
      "Stop [negative action]. Start [positive outcome]",
      "The bridge between your current [problem] and desired [outcome]"
    ] 
  }
];

const MentalTriggersSection: React.FC<MentalTriggersSectionProps> = ({
  onSelectTrigger,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Mental Triggers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add psychological triggers to your ad copy to boost engagement and conversion rates.
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full font-normal justify-start"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Browse Psychological Triggers
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-card">
            <DialogHeader>
              <DialogTitle>Psychological Ad Triggers</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] mt-2 pr-4">
              <div className="space-y-6">
                {triggers.map((triggerGroup, groupIndex) => (
                  <div key={`group-${groupIndex}`} className="space-y-2">
                    <h3 className="text-sm font-medium text-primary">{triggerGroup.category}</h3>
                    <div className="space-y-2">
                      {triggerGroup.items.map((trigger, index) => (
                        <div 
                          key={`trigger-${groupIndex}-${index}`} 
                          className="flex items-start border p-2 rounded-md hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm">{trigger}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectTrigger(trigger)}
                            className="h-8 w-8 p-0 ml-2"
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MentalTriggersSection;
