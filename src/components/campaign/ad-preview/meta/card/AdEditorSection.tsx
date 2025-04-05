
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MetaAd } from "@/hooks/adGeneration/types";
import TriggerButtonInline from "../../TriggerButtonInline";
import { EditorSectionProps } from "./types";
import {
  FileImage,
  Type,
  Hash,
  AlignLeft,
  MessageSquare,
} from "lucide-react";

const AdEditorSection: React.FC<EditorSectionProps> = ({
  ad,
  isEditing,
  onUpdate,
  onSelectTrigger,
}) => {
  const [activeTab, setActiveTab] = React.useState("content");

  const handleChange = (field: keyof MetaAd, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...ad,
        [field]: value,
      });
    }
  };

  // Custom handler for format which is optional and uses a string literal type
  const handleFormatChange = (format: "feed" | "story" | "reel") => {
    if (onUpdate) {
      onUpdate({
        ...ad,
        format // This is now allowed since we updated the type definition
      });
    }
  };

  const handleInsertTrigger = (trigger: string) => {
    if (onSelectTrigger) {
      onSelectTrigger(trigger);
    }
  };

  const getCharCount = (text: string) => {
    return text ? text.length : 0;
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Headline</label>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">
                  {getCharCount(ad.headline)}/40
                </span>
                {isEditing && <TriggerButtonInline onInsert={handleInsertTrigger} />}
              </div>
            </div>
            <Input
              value={ad.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="Enter ad headline"
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              maxLength={40}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Primary Text</label>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">
                  {getCharCount(ad.primaryText)}/125
                </span>
                {isEditing && <TriggerButtonInline onInsert={handleInsertTrigger} />}
              </div>
            </div>
            <Textarea
              value={ad.primaryText}
              onChange={(e) => handleChange("primaryText", e.target.value)}
              placeholder="Enter primary text for your ad"
              disabled={!isEditing}
              className={`min-h-[100px] ${!isEditing ? "bg-muted" : ""}`}
              maxLength={125}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Call to Action</label>
              <span className="text-xs text-muted-foreground">
                {getCharCount(ad.description)}/20
              </span>
            </div>
            <Input
              value={ad.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter call to action (e.g., Learn More)"
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              maxLength={20}
            />
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Image Prompt</label>
            </div>
            <Textarea
              value={ad.imagePrompt || ""}
              onChange={(e) => handleChange("imagePrompt", e.target.value)}
              placeholder="Describe the image you want to generate"
              disabled={!isEditing}
              className={`min-h-[100px] ${!isEditing ? "bg-muted" : ""}`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Describe the image in detail for better results
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Format</label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={ad.format === "feed" ? "default" : "outline"}
                className={`cursor-pointer ${isEditing ? "" : "opacity-50"}`}
                onClick={() => isEditing && handleFormatChange("feed")}
              >
                Feed
              </Badge>
              <Badge
                variant={ad.format === "story" ? "default" : "outline"}
                className={`cursor-pointer ${isEditing ? "" : "opacity-50"}`}
                onClick={() => isEditing && handleFormatChange("story")}
              >
                Story
              </Badge>
              <Badge
                variant={ad.format === "reel" ? "default" : "outline"}
                className={`cursor-pointer ${isEditing ? "" : "opacity-50"}`}
                onClick={() => isEditing && handleFormatChange("reel")}
              >
                Reel
              </Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdEditorSection;
