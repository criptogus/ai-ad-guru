
import React, { useRef, useState } from "react";
import { BannerFormat, BannerPlatform, BannerTemplate } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, RefreshCw, Sparkles, GridIcon } from "lucide-react";
import ImagePromptForm from "../../ImagePromptForm";
import UserImageBank from "../../UserImageBank";

interface ImageTabProps {
  template: BannerTemplate;
  platform: BannerPlatform;
  format: BannerFormat;
  backgroundImage: string | null;
  userImages: string[];
  onGenerateAIImage: (prompt: string) => Promise<void>;
  onRegenerateImage: () => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  onSelectUserImage: (imageUrl: string) => void;
  isGeneratingImage: boolean;
  isUploading: boolean;
}

const ImageTab: React.FC<ImageTabProps> = ({
  template,
  platform,
  format,
  backgroundImage,
  userImages,
  onGenerateAIImage,
  onRegenerateImage,
  onUploadImage,
  onSelectUserImage,
  isGeneratingImage,
  isUploading
}) => {
  const [imageSubTab, setImageSubTab] = useState<"generate" | "upload" | "bank">("generate");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {!backgroundImage ? (
        <div className="space-y-4">
          <Tabs value={imageSubTab} onValueChange={(v) => setImageSubTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="generate" className="flex items-center gap-1">
                <Sparkles size={14} /> Generate
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <Upload size={14} /> Upload
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-1">
                <GridIcon size={14} /> Image Bank
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <ImagePromptForm 
                    template={template} 
                    platform={platform}
                    format={format}
                    onSubmit={onGenerateAIImage}
                    isGenerating={isGeneratingImage}
                  />
                </div>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-accent/30">
                    <h3 className="font-medium mb-2">Template Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Template:</span>
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">{template.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium capitalize">{format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform:</span>
                        <span className="font-medium capitalize">{platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="border rounded-md p-6">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Upload size={16} /> Upload Your Own Image
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your own image to use as the banner background. It will be saved to your image bank.
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="w-full h-32 border-dashed"
                  onClick={handleTriggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw size={24} className="animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <span>Click to browse files</span>
                      <span className="text-xs text-muted-foreground">Supports JPG, PNG, GIF</span>
                    </div>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="bank">
              <UserImageBank 
                images={userImages}
                onSelectImage={onSelectUserImage}
                isLoading={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100 max-h-[300px]">
            <img
              src={backgroundImage}
              alt="Banner Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={onRegenerateImage}
              disabled={isGeneratingImage}
              className="flex items-center gap-2"
            >
              {isGeneratingImage ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Regenerate Image
            </Button>
            <Button
              variant="outline"
              onClick={handleTriggerFileInput}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Upload New Image
            </Button>
            <Button
              variant="outline"
              onClick={() => setImageSubTab("bank")}
              className="flex items-center gap-2"
            >
              <GridIcon size={16} />
              Choose from Image Bank
            </Button>
          </div>
          
          {imageSubTab === "bank" && (
            <UserImageBank 
              images={userImages}
              onSelectImage={onSelectUserImage}
              isLoading={false}
            />
          )}
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
};

export default ImageTab;
