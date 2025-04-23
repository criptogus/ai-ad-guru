
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

    // Format URL for proper validation
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    // Validate URL format
    try {
      new URL(formattedUrl);
    } catch (e) {
      setAnalysisError("Invalid URL format. Use format: example.com");
      toast.error("Invalid URL format. Use format: example.com");
      return;
    }

    setIsAnalyzing(true);
    
    try {
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
          industry: result.industry || "",
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
      <h2 className="text-xl font-semibold">Website Analysis</h2>
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
          disabled={isAnalyzing || !url}
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
          </label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="Ex: Digital Marketing"
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
