
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TriggerButtonInlineProps {
  onSelectTrigger: (trigger: string) => void;
  children?: React.ReactNode;
  className?: string;
}

// Psychological triggers grouped by category
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

export const TriggerButtonInline: React.FC<TriggerButtonInlineProps> = ({
  onSelectTrigger,
  children,
  className = "",
}) => {
  const handleCopyTrigger = (trigger: string) => {
    onSelectTrigger(trigger);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className} flex items-center gap-2`}
        >
          <Sparkles className="h-4 w-4" />
          {children || "Add Trigger"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Psychological Ad Triggers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-2 max-h-[70vh] pr-4">
          <div className="space-y-6 py-2">
            {triggers.map((category, catIndex) => (
              <div key={`cat-${catIndex}`} className="space-y-3">
                <h3 className="text-sm font-medium">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((trigger, i) => (
                    <div 
                      key={`trigger-${catIndex}-${i}`} 
                      className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{trigger}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopyTrigger(trigger)}
                      >
                        Copy
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
  );
};

export default TriggerButtonInline;
