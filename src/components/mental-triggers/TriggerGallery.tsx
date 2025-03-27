
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import useMentalTriggers from './useMentalTriggers';
import { TriggerCategory } from './types';
import { TriggerItem } from './TriggerItem';

interface TriggerGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTrigger: (trigger: string) => void;
}

const TriggerGallery: React.FC<TriggerGalleryProps> = ({
  open,
  onOpenChange,
  onSelectTrigger
}) => {
  const { 
    categories, 
    filteredTriggers, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery,
    setSearchQuery
  } = useMentalTriggers();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value as TriggerCategory);
    }
  };
  
  const handleSelectTrigger = (e: React.MouseEvent, promptTemplate: string) => {
    // Explicitly prevent default and stop propagation to avoid any navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onSelectTrigger callback with the prompt template
    onSelectTrigger(promptTemplate);
    
    // Close the dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className="sm:max-w-2xl max-h-[80vh] flex flex-col" 
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // We still want Escape to close the dialog
          onOpenChange(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Mental Triggers Gallery</DialogTitle>
          <DialogDescription>
            Select a psychological trigger to enhance your ad copy's effectiveness
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mental triggers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1"
              >
                <span>{category.emoji}</span> {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredTriggers.map(trigger => (
                <TriggerItem 
                  key={trigger.id}
                  trigger={trigger}
                  onSelect={(e) => handleSelectTrigger(e, trigger.promptTemplate)}
                />
              ))}
              
              {filteredTriggers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No mental triggers found matching your search.
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TriggerGallery;
