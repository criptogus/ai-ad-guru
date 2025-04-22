import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Smartphone, Video } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { InstagramPreview } from "./instagram-preview";
import InstagramAdEditor from "./InstagramAdEditor";
import { toast } from "sonner";

interface InstagramAdCardProps {
  ad: MetaAd;
  companyName: string;
  index: number;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const InstagramAdCard: React.FC<InstagramAdCardProps> = ({
  ad,
  companyName,
  index,
  isLoading = false,
  onGenerateImage,
  onUpdateAd,
  onDuplicate,
  onDelete,
  isEditing = false,
  onEdit,
  onSave,
  onCancel
}) => {
  const [format, setFormat] = useState<"feed" | "story" | "reel">("feed");
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);

  const handleUpdateAd = (updatedAd: MetaAd) => {
    setEditedAd(updatedAd);
    if (onUpdateAd) {
      onUpdateAd(updatedAd);
    }
  };

  const handleCopy = () => {
    const text = `${editedAd.headline}\n\n${editedAd.primaryText}\n\n${editedAd.description || ''}`;
    navigator.clipboard.writeText(text);
    toast.success("Ad content copied to clipboard");
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleGenerateImage = async (): Promise<void> => {
    if (onGenerateImage) {
      return onGenerateImage();
    }
    return Promise.resolve();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <h3 className="text-lg font-semibold">Instagram Ad #{index + 1}</h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                Copy
              </Button>
              {onDuplicate && (
                <Button variant="ghost" size="sm" onClick={onDuplicate}>
                  Duplicate
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Tabs value={format} onValueChange={(v) => setFormat(v as typeof format)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="feed">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="story">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Story
                </TabsTrigger>
                <TabsTrigger value="reel">
                  <Video className="h-4 w-4 mr-2" />
                  Reel
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <InstagramPreview
              ad={isEditing ? editedAd : ad}
              companyName={companyName}
              index={index}
              loadingImageIndex={isLoading ? index : null}
              onGenerateImage={handleGenerateImage}
              onUpdateAd={handleUpdateAd}
              viewMode={format}
            />
          </div>

          <div>
            <InstagramAdEditor
              ad={isEditing ? editedAd : ad}
              isEditing={isEditing}
              onUpdateAd={handleUpdateAd}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramAdCard;
