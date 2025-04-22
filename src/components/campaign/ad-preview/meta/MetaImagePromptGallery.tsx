
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface MetaImagePromptGalleryProps {
  ad: MetaAd;
  loading: boolean;
  onGenerateImage: () => Promise<void>;
  initialPrompt?: string;
  onSelectPrompt?: (prompt: string) => void;
  displayMode?: "horizontal" | "vertical";
}

const MetaImagePromptGallery: React.FC<MetaImagePromptGalleryProps> = ({
  ad,
  loading,
  onGenerateImage,
  initialPrompt,
  onSelectPrompt,
  displayMode = "vertical"
}) => {
  // If we're in template selection mode (with onSelectPrompt callback)
  if (onSelectPrompt) {
    const promptTemplates = [
      "Professional product photo on white background",
      "Happy customer using the product",
      "Modern lifestyle image with product",
      "Before and after transformation",
      "Product in natural environment",
      "Close-up detail of product features"
    ];

    return (
      <div className={`grid ${displayMode === "horizontal" ? "grid-flow-col auto-cols-max gap-3" : "grid-cols-1 gap-2"}`}>
        {promptTemplates.map((template, idx) => (
          <div 
            key={idx} 
            className="border rounded-md p-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSelectPrompt(template)}
          >
            {template}
          </div>
        ))}
      </div>
    );
  }

  // Standard mode - show the current prompt and generate button
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
