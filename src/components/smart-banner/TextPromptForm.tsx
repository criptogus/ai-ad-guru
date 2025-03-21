
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { TextElement } from "@/hooks/smart-banner/useBannerEditor";

interface TextPromptFormProps {
  textElements: TextElement[];
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onGenerateAIText: (elementId: string, type: "headline" | "subheadline" | "cta") => Promise<void>;
}

const TextPromptForm: React.FC<TextPromptFormProps> = ({
  textElements,
  onUpdateTextElement,
  onGenerateAIText
}) => {
  const headline = textElements.find(el => el.type === "headline");
  const subheadline = textElements.find(el => el.type === "subheadline");
  const cta = textElements.find(el => el.type === "cta");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-medium">Banner Text Elements</h3>
        <p className="text-sm text-muted-foreground">
          Customize the text elements of your banner
        </p>
      </div>

      <div className="space-y-4">
        {headline && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="headline">Headline</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => onGenerateAIText(headline.id, "headline")}
                  >
                    <Sparkles size={12} />
                    Generate
                  </Button>
                </div>
                <Input
                  id="headline"
                  value={headline.content}
                  onChange={(e) => onUpdateTextElement(headline.id, { content: e.target.value })}
                  placeholder="Main headline text"
                  className="text-base font-medium"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {subheadline && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => onGenerateAIText(subheadline.id, "subheadline")}
                  >
                    <Sparkles size={12} />
                    Generate
                  </Button>
                </div>
                <Input
                  id="subheadline"
                  value={subheadline.content}
                  onChange={(e) => onUpdateTextElement(subheadline.id, { content: e.target.value })}
                  placeholder="Supporting text"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {cta && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cta">Call to Action</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => onGenerateAIText(cta.id, "cta")}
                  >
                    <Sparkles size={12} />
                    Generate
                  </Button>
                </div>
                <Input
                  id="cta"
                  value={cta.content}
                  onChange={(e) => onUpdateTextElement(cta.id, { content: e.target.value })}
                  placeholder="Call to action button text"
                  className="text-sm font-medium"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextPromptForm;
