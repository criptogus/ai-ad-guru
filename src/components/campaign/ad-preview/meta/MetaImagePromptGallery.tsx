
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface MetaImagePromptGalleryProps {
  ad: MetaAd;
  loading: boolean;
  onGenerateImage: () => Promise<void>;
}

const MetaImagePromptGallery: React.FC<MetaImagePromptGalleryProps> = ({
  ad,
  loading,
  onGenerateImage
}) => {
  if (!ad.imagePrompt) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Prompt de Imagem:</h3>
          <p className="text-sm text-muted-foreground">{ad.imagePrompt}</p>
        </div>
        
        <Button
          onClick={onGenerateImage}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Imagem...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Gerar Imagem
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MetaImagePromptGallery;
