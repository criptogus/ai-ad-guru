
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TriggerCard from "./TriggerCard";
import { triggerData } from "./triggerData";

interface TriggerGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrigger: (trigger: string) => void;
}

const TriggerGallery: React.FC<TriggerGalleryProps> = ({
  open,
  onOpenChange,
  onSelectTrigger,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("urgency");

  const availableCategories = Object.keys(triggerData);

  const handleSelectTrigger = (trigger: string) => {
    onSelectTrigger(trigger);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:w-[540px] p-0" side="right">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">Mental Triggers Gallery</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Persuasive copy techniques proven to increase clicks and conversions
          </p>
        </SheetHeader>

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <div className="px-4 border-b overflow-x-auto">
            <TabsList className="h-12 w-full justify-start">
              {availableCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {triggerData[category].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)] p-6">
            {availableCategories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  {triggerData[category].triggers.map((trigger, index) => (
                    <TriggerCard
                      key={index}
                      trigger={trigger}
                      category={triggerData[category].label}
                      onSelect={() => handleSelectTrigger(trigger)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TriggerGallery;
