
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectPrompt }) => {
  const promptTemplates = [
    {
      name: "Tech Innovation",
      category: "Innovation",
      prompt: "A sleek, futuristic device or interface in a minimalist setting, conveying innovation and cutting-edge technology"
    },
    {
      name: "Professional Success",
      category: "Business",
      prompt: "A confident professional in a modern workspace with subtle elements of success and achievement"
    },
    {
      name: "Business Growth",
      category: "Business",
      prompt: "Abstract visualization of business growth with upward trends, expanding elements, and professional aesthetics"
    },
    {
      name: "Team Collaboration",
      category: "Workplace",
      prompt: "Diverse team in a modern office environment collaborating effectively with visible synergy and productivity"
    },
    {
      name: "Premium Service",
      category: "Business",
      prompt: "High-end representation of professional service with dramatic lighting and premium atmosphere"
    },
    {
      name: "Data Visualization",
      category: "Technology",
      prompt: "Clean and modern data visualization with charts showing positive business results on sleek displays"
    },
    {
      name: "Leadership Vision",
      category: "Business",
      prompt: "A visionary leader looking ahead with confidence, symbolizing direction and strategic thinking"
    },
    {
      name: "Digital Transformation",
      category: "Technology",
      prompt: "Visual representation of digital transformation with flowing data elements and modern technology integration"
    }
  ];

  // Group templates by category
  const templatesByCategory = promptTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof promptTemplates>);

  return (
    <Card className="border h-full">
      <CardContent className="p-4">
        <Label className="text-sm font-medium mb-3 block">Quick Prompt Templates</Label>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category} className="space-y-2">
                <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((template, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-auto py-2 px-3 text-left w-full hover:border-primary"
                      onClick={() => onSelectPrompt(template.prompt)}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium truncate">{template.name}</p>
                          <Badge variant="outline" className="text-[10px] h-4 px-1 ml-2 shrink-0">
                            <MessageSquare className="h-2.5 w-2.5 mr-1" />
                            Prompt
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground break-words line-clamp-2">
                          {template.prompt}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PromptTemplates;
