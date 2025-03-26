
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";

interface GeneratedImagePreviewProps {
  generatedImageUrl: string | null;
  selectedTemplate: InstagramTemplate | null;
  mainText: string;
  onReset: () => void;
}

const GeneratedImagePreview: React.FC<GeneratedImagePreviewProps> = ({
  generatedImageUrl,
  selectedTemplate,
  mainText,
  onReset,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {generatedImageUrl ? (
              <div className="border rounded-md overflow-hidden">
                <img
                  src={generatedImageUrl}
                  alt="Generated Instagram Ad"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="h-80 bg-muted/20 flex items-center justify-center text-muted-foreground rounded-md">
                No image generated yet
              </div>
            )}
          </div>
          
          <div>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Template Information</h3>
                {selectedTemplate && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Template</p>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Customization</p>
                      <p className="text-sm text-muted-foreground">{mainText || "[None]"}</p>
                    </div>
                    <div className="flex gap-3 pt-3">
                      <Button variant="outline" onClick={onReset}>
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedImagePreview;
