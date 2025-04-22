
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
      "Profissional usando nosso produto/serviço com expressão de satisfação",
      "Imagem de antes e depois mostrando transformação",
      "Cliente satisfeito em ambiente de trabalho moderno",
      "Foto profissional do produto em fundo limpo",
      "Equipe de profissionais trabalhando com nosso serviço",
      "Pessoa mostrando resultado positivo usando nosso produto",
      "Ambiente de trabalho moderno e produtivo",
      "Profissional soridente demonstrando nosso serviço",
      "Gráfico de crescimento ou resultados positivos"
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
          <h3 className="text-sm font-medium">Instruções para Imagem:</h3>
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
              Gerar Imagem com DALL-E
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MetaImagePromptGallery;
