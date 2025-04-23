
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader, AlertCircle } from "lucide-react";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WebsiteAnalysisStepProps {
  campaignData: any;
  analysisResult: any;
  setAnalysisResult: React.Dispatch<React.SetStateAction<any>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: (data: any) => void;
}

const WebsiteAnalysisStep: React.FC<WebsiteAnalysisStepProps> = ({
  campaignData,
  analysisResult,
  setAnalysisResult,
  isAnalyzing,
  setIsAnalyzing,
  onNext
}) => {
  const [url, setUrl] = useState(campaignData.websiteUrl || "");
  const [formData, setFormData] = useState({
    businessName: campaignData.businessName || "",
    businessType: campaignData.businessType || "",
    industry: campaignData.industry || "",
    products: campaignData.products || "",
    keywords: campaignData.keywords || ""
  });
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    setAnalysisError(null);
    
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      setAnalysisError("Invalid URL format. Use format: example.com");
      toast.error("Invalid URL format. Use format: example.com");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log('Calling analyzeWebsite with URL:', formattedUrl);
      
      const result = await analyzeWebsite({
        url: formattedUrl,
        userId: user?.id || "anonymous"
      });

      if (result) {
        console.log('Analysis result received:', result);
        setAnalysisResult(result);
        
        // Update form with the analysis results
        setFormData({
          businessName: result.companyName || "",
          businessType: result.businessDescription || "",
          industry: result.brandTone || "",
          products: result.uniqueSellingPoints?.join(", ") || "",
          keywords: result.keywords?.join(", ") || ""
        });

        toast.success("Website analysis completed!");
      } else {
        throw new Error("No result returned from analysis");
      }
    } catch (error: any) {
      console.error("Error analyzing website:", error);
      setAnalysisError(error?.message || "Failed to analyze website. Please try again or fill in manually.");
      toast.error("Analysis Failed", {
        description: error?.message || "Failed to analyze website. Please try again or fill in manually."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Prepare data for the next step
    const keywordsArray = formData.keywords.split(",").map(k => k.trim()).filter(Boolean);
    const productsArray = formData.products.split(",").map(p => p.trim()).filter(Boolean);
    
    onNext({
      websiteUrl: url,
      businessName: formData.businessName,
      businessType: formData.businessType, 
      industry: formData.industry,
      products: productsArray,
      keywords: keywordsArray
    });
  };

  const isFormValid = formData.businessName && formData.businessType && formData.industry;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Análise do Website</h2>
      <p className="text-muted-foreground">
        Insira a URL do seu site para nossa IA analisar e extrair informações relevantes para sua campanha.
      </p>

      <div className="flex gap-2">
        <Input 
          placeholder="www.seusite.com.br" 
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (analysisError) setAnalysisError(null);
          }}
          className="flex-1"
        />
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !url}
          className="whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Analisando...
            </>
          ) : "Analisar Site"}
        </Button>
      </div>
      
      {analysisError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na análise</AlertTitle>
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium mb-1">
            Nome do Negócio
          </label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Ex: Zero Digital Agency"
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1">
            Indústria/Segmento
          </label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="Ex: Marketing Digital"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="businessType" className="block text-sm font-medium mb-1">
            Descrição do Negócio
          </label>
          <Textarea
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            placeholder="Ex: Agência especializada em marketing digital para pequenas empresas"
            rows={3}
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="products" className="block text-sm font-medium mb-1">
            Produtos/Serviços (separados por vírgula)
          </label>
          <Textarea
            id="products"
            name="products"
            value={formData.products}
            onChange={handleInputChange}
            placeholder="Ex: Marketing de conteúdo, SEO, Anúncios pagos"
            rows={2}
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            Palavras-chave (separadas por vírgula)
          </label>
          <Textarea
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            placeholder="Ex: marketing digital, SEO, performance, ROI"
            rows={2}
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!isFormValid}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default WebsiteAnalysisStep;
