
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader, AlertCircle, Globe } from "lucide-react";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useSecuredOperation } from '@/hooks/useSecuredOperation';

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
  const [languageDetected, setLanguageDetected] = useState<string | null>(null);
  const { user } = useAuth();
  const { executeSecured, isProcessing: isSecureProcessing } = useSecuredOperation();

  const getLanguageDisplayName = (code?: string): string => {
    if (!code) return "Unknown";
    
    const languages: Record<string, string> = {
      'en': "English",
      'pt': "Portuguese",
      'es': "Spanish",
      'fr': "French",
      'de': "German",
      'it': "Italian",
      'nl': "Dutch",
      'ru': "Russian",
      'zh': "Chinese",
      'ja': "Japanese"
    };
    
    return languages[code.toLowerCase().split('-')[0]] || code;
  };

  useEffect(() => {
    if (analysisResult?.language) {
      setLanguageDetected(analysisResult.language);
    }
  }, [analysisResult]);

  const handleAnalyze = async () => {
    console.log("handleAnalyze called with URL:", url);
    setAnalysisError(null);
    
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    try {
      console.log("Validating URL:", formattedUrl);
      new URL(formattedUrl);
    } catch (e) {
      console.error("URL validation error:", e);
      setAnalysisError("Invalid URL format. Use format: example.com");
      toast.error("Invalid URL format. Use format: example.com");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log("Starting secured website analysis operation");
      const result = await executeSecured(
        async () => {
          console.log('Calling analyzeWebsite with URL:', formattedUrl);
          return analyzeWebsite({
            url: formattedUrl,
            userId: user?.id || "anonymous"
          });
        },
        {
          action: 'website_analysis',
          requiredCredits: 2,
          metadata: { url: formattedUrl }
        }
      );
      
      console.log('Analysis result received:', result);

      if (!result) {
        setAnalysisError("No analysis result returned. Please try again.");
        return;
      }

      setAnalysisResult(result);
      
      if (result.language) {
        setLanguageDetected(result.language);
        console.log(`Language detected: ${result.language} (${getLanguageDisplayName(result.language)})`);
      }
      
      setFormData({
        businessName: result.companyName || "",
        businessType: result.businessDescription || "",
        industry: result.industry || "",
        products: result.uniqueSellingPoints?.join(", ") || "",
        keywords: result.keywords?.join(", ") || ""
      });

      toast.success("Website analysis completed!");
    } catch (error: any) {
      console.error("Error analyzing website:", error, error?.message, error?.stack);
      setAnalysisError(error?.message || "Failed to analyze website. Please try again or fill in manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    console.log("handleNext called with formData:", formData);
    const keywordsArray = formData.keywords.split(",").map(k => k.trim()).filter(Boolean);
    const productsArray = formData.products.split(",").map(p => p.trim()).filter(Boolean);
    
    const updatedData = {
      websiteUrl: url,
      businessName: formData.businessName,
      businessType: formData.businessType, 
      industry: formData.industry,
      products: productsArray,
      keywords: keywordsArray,
      language: languageDetected
    };
    
    console.log("Passing data to onNext:", updatedData);
    onNext(updatedData);
  };

  const isFormValid = formData.businessName && formData.businessType && formData.industry;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Website Analysis</h2>
        
        {languageDetected && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{getLanguageDisplayName(languageDetected)}</span>
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Enter your website URL so our AI can analyze it and extract relevant information for your campaign.
      </p>

      <div className="flex gap-2">
        <Input 
          placeholder="www.yoursite.com" 
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (analysisError) setAnalysisError(null);
          }}
          className="flex-1"
        />
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !url || isSecureProcessing}
          className="whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              Analyzing...
            </>
          ) : "Analyze Site"}
        </Button>
      </div>
      
      {analysisError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}
      
      {analysisResult?.fromCache && (
        <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Cached Analysis</AlertTitle>
          <AlertDescription>
            This analysis is from our cache. The data was analyzed previously on {
              new Date(analysisResult.cachedAt).toLocaleDateString()
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium mb-1">
            Business Name
          </label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Ex: Zero Digital Agency"
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1">
            Industry/Segment
            {languageDetected && (
              <span className="text-xs text-muted-foreground ml-2">
                (detected language: {getLanguageDisplayName(languageDetected)})
              </span>
            )}
          </label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder={`Ex: ${languageDetected === 'pt' ? 'Marketing Digital' : 'Digital Marketing'}`}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="businessType" className="block text-sm font-medium mb-1">
            Business Description
          </label>
          <Textarea
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            placeholder="Ex: Digital marketing agency specializing in small businesses"
            rows={3}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="products" className="block text-sm font-medium mb-1">
            Products/Services (comma separated)
          </label>
          <Textarea
            id="products"
            name="products"
            value={formData.products}
            onChange={handleInputChange}
            placeholder="Ex: Content marketing, SEO, Paid advertising"
            rows={2}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            Keywords (comma separated)
          </label>
          <Textarea
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            placeholder="Ex: digital marketing, SEO, performance, ROI"
            rows={2}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!isFormValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WebsiteAnalysisStep;
