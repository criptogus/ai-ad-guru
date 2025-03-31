
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe } from 'lucide-react';

const WebsiteAnalysisPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive"
      });
      return;
    }

    // Simple URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate analysis with timeout
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Your website has been successfully analyzed"
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Website Analysis</h1>
        <p className="text-muted-foreground">
          Analyze your website content to optimize your AI-powered ad campaigns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Analyze Your Website
          </CardTitle>
          <CardDescription>
            Enter your website URL to extract key information and generate AI ad recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          {!isAnalyzing && !analysisComplete ? (
            <div className="p-12 text-center border rounded-md">
              <p className="text-muted-foreground">
                Enter your website URL above and click "Analyze" to get started
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="p-12 text-center border rounded-md">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                AI is analyzing your website content and structure...
              </p>
            </div>
          ) : (
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="usp">Unique Selling Points</TabsTrigger>
                <TabsTrigger value="recommendations">Ad Recommendations</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 border rounded-md p-4">
                <TabsContent value="overview" className="p-0 mt-0">
                  <h3 className="text-lg font-medium mb-4">Website Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Main Topic:</p>
                      <p className="text-muted-foreground">AI-powered advertising automation</p>
                    </div>
                    <div>
                      <p className="font-medium">Target Audience:</p>
                      <p className="text-muted-foreground">Marketing managers, small business owners</p>
                    </div>
                    <div>
                      <p className="font-medium">Primary Message:</p>
                      <p className="text-muted-foreground">Automate ad creation and optimization across platforms</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="keywords" className="p-0 mt-0">
                  <h3 className="text-lg font-medium mb-4">Top Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {["AI advertising", "ad automation", "ad optimization", "Google Ads", "Meta Ads", "DALL·E 3", "marketing automation"].map((kw) => (
                      <span key={kw} className="bg-secondary px-3 py-1 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="usp" className="p-0 mt-0">
                  <h3 className="text-lg font-medium mb-4">Unique Selling Points</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>AI-powered ad creation saves time and improves results</li>
                    <li>Multi-platform support (Google, Meta, LinkedIn)</li>
                    <li>Automated optimization increases ROI</li>
                    <li>Credit-based system for flexible usage</li>
                  </ul>
                </TabsContent>

                <TabsContent value="recommendations" className="p-0 mt-0">
                  <h3 className="text-lg font-medium mb-4">Ad Recommendations</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Google Search Ad</h4>
                      <p className="text-sm mb-2 text-muted-foreground">Headline: AI-Powered Ad Creation | Save Time & Boost ROI | Free Trial</p>
                      <p className="text-sm text-muted-foreground">Description: Create optimized ads in seconds with our AI platform. Increase conversions by 35% on average. Start your free trial today!</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Meta Ad</h4>
                      <p className="text-sm mb-2 text-muted-foreground">Focus on visual results showing before/after of ad performance</p>
                      <p className="text-sm text-muted-foreground">Message: "Stop wasting time on manual ad creation. Our AI creates high-performing ads across platforms in seconds."</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteAnalysisPage;
