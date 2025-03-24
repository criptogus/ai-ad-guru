
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { BannerFormat, BannerPlatform, BannerTemplate } from "../types";
import { BannerElement, TextElement } from "@/hooks/smart-banner/types";
import BannerEditorTabs from "./BannerEditorTabs";

interface BannerEditorProps {
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
  onGoToExport: () => void;
  onUpdateBannerElements: (elements: BannerElement[]) => void;
}

const BannerEditor: React.FC<BannerEditorProps> = ({
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
  onGoToExport,
  onUpdateBannerElements
}) => {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Editor</CardTitle>
          <CardDescription>
            Customize your "{template.name}" banner for {platform} ({format})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannerEditorTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            template={template}
            format={format}
            platform={platform}
            backgroundImage={backgroundImage}
            textElements={textElements}
            bannerElements={bannerElements}
            userImages={userImages}
            onUpdateTextElement={onUpdateTextElement}
            onGenerateAIImage={onGenerateAIImage}
            onRegenerateImage={onRegenerateImage}
            onGenerateAIText={onGenerateAIText}
            onUploadImage={onUploadImage}
            onSelectUserImage={onSelectUserImage}
            isGeneratingImage={isGeneratingImage}
            isUploading={isUploading}
            onUpdateBannerElements={onUpdateBannerElements}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab(activeTab === "image" ? "text" : activeTab === "text" ? "elements" : "image")}
          >
            {activeTab === "image" ? "Next: Text" : activeTab === "text" ? "Next: Elements" : "Back to Image"}
          </Button>
          <Button onClick={onGoToExport} className="gap-1">
            Continue to Export <MoveRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BannerEditor;
