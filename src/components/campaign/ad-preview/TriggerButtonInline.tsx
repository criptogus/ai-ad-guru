
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TriggerButtonInlineProps {
  onSelectTrigger?: (trigger: string) => void;
  onInsert?: (trigger: string) => void; // For backward compatibility
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
  onInsert,
  children,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter triggers based on search query and active tab
  const filteredTriggers = triggers.flatMap(category => {
    return category.items
      .filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeTab === "all" || activeTab === category.category.toLowerCase().replace(/\s+/g, '-'))
      )
      .map(item => ({ category: category.category, text: item }));
  });

  // Unified handler that works with either onSelectTrigger or onInsert
  // but does not perform any navigation
  const handleSelectTrigger = (trigger: string) => {
    if (onSelectTrigger) {
      onSelectTrigger(trigger);
    }
    if (onInsert) {
      onInsert(trigger);
    }
    setIsOpen(false); // Close the dialog after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className} flex items-center gap-2`}
          onClick={(e) => {
            e.preventDefault(); // Prevent any form submission
            e.stopPropagation(); // Stop event bubbling
            setIsOpen(true);
          }}
        >
          <Sparkles className="h-4 w-4" />
          {children || "Add Trigger"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Psychological Ad Triggers</DialogTitle>
        </DialogHeader>
        
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search triggers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto mb-2">
            <TabsTrigger value="all">All</TabsTrigger>
            {triggers.map((category, idx) => (
              <TabsTrigger 
                key={idx} 
                value={category.category.toLowerCase().replace(/\s+/g, '-')}
              >
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-4 pr-4 py-2">
              {filteredTriggers.length > 0 ? (
                filteredTriggers.map((trigger, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm pr-4 flex-grow">{trigger.text}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSelectTrigger(trigger.text)}
                      className="whitespace-nowrap"
                    >
                      Insert
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No triggers found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TriggerButtonInline;
