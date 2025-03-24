
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Type, Layers } from "lucide-react";
import ImageTab from "./tabs/ImageTab";
import TextTab from "./tabs/TextTab";
import ElementsTab from "./tabs/ElementsTab";
import { BannerFormat, BannerPlatform, BannerTemplate } from "../types";
import { BannerElement, TextElement } from "@/hooks/smart-banner/types";

interface BannerEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  template: BannerTemplate;
  format: BannerFormat;
  platform: BannerPlatform;
  backgroundImage: string | null;
  textElements: TextElement[];
  bannerElements: BannerElement[];
  userImages: string[];
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onGenerateAIImage: (prompt: string) => Promise<void>;
  onRegenerateImage: () => Promise<void>;
  onGenerateAIText: (elementId: string, type: "headline" | "subheadline" | "cta") => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  onSelectUserImage: (imageUrl: string) => void;
  isGeneratingImage: boolean;
  isUploading: boolean;
  onUpdateBannerElements: (elements: BannerElement[]) => void;
}

const BannerEditorTabs: React.FC<BannerEditorTabsProps> = ({
  activeTab,
  setActiveTab,
  template,
  format,
  platform,
  backgroundImage,
  textElements,
  bannerElements,
  userImages,
  onUpdateTextElement,
  onGenerateAIImage,
  onRegenerateImage,
  onGenerateAIText,
  onUploadImage,
  onSelectUserImage,
  isGeneratingImage,
  isUploading,
  onUpdateBannerElements
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="image" className="flex items-center gap-2">
          <Image size={16} /> Background
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <Type size={16} /> Text
        </TabsTrigger>
        <TabsTrigger value="elements" className="flex items-center gap-2">
          <Layers size={16} /> Elements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image">
        <ImageTab
          template={template}
          platform={platform}
          format={format}
          backgroundImage={backgroundImage}
          userImages={userImages}
          onGenerateAIImage={onGenerateAIImage}
          onRegenerateImage={onRegenerateImage}
          onUploadImage={onUploadImage}
          onSelectUserImage={onSelectUserImage}
          isGeneratingImage={isGeneratingImage}
          isUploading={isUploading}
        />
      </TabsContent>

      <TabsContent value="text">
        <TextTab
          textElements={textElements}
          onUpdateTextElement={onUpdateTextElement}
          onGenerateAIText={onGenerateAIText}
        />
      </TabsContent>

      <TabsContent value="elements">
        <ElementsTab
          bannerElements={bannerElements}
          onUpdateBannerElements={onUpdateBannerElements}
        />
      </TabsContent>
    </Tabs>
  );
};

export default BannerEditorTabs;
