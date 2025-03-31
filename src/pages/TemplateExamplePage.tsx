
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, ThumbsUp } from 'lucide-react';

const TemplateExamplePage: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    
    toast({
      title: "Template copied",
      description: "The template has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ad Templates</h1>
        <p className="text-muted-foreground">
          Browse proven ad templates and customize them for your campaigns
        </p>
      </div>
      
      <Tabs defaultValue="google" className="space-y-6">
        <TabsList>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="meta">Meta Ads</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "g1",
                title: "Problem-Solution Template",
                description: "Addresses pain points and offers your solution",
                headline: "Struggling With [Problem]? | Our [Solution] Helps | [Benefit] Today",
                body: "Tired of [specific problem]? Our [product/service] helps you [achieve benefit] without [pain point]. [Call to action] now and get [special offer].",
                tag: "Best Performer"
              },
              {
                id: "g2",
                title: "Social Proof Template",
                description: "Leverages testimonials and social validation",
                headline: "Join [Number] Happy Customers | [Product] With [Benefit] | Try Risk-Free",
                body: "[Number] customers trust us for [key benefit]. Our [product/service] delivers [specific result]. Read their stories and see why they chose us. Limited offer: [special deal].",
                tag: "High CTR"
              },
              {
                id: "g3",
                title: "Urgency Template",
                description: "Creates FOMO with limited-time offers",
                headline: "Last Chance: [Offer] Ends Soon | [Product] With [Benefit] | Save [X]%",
                body: "Only [X days/hours] left! Get our [product/service] with [key benefit] before prices increase. Save [discount amount] when you [action] today. Don't miss out!",
                tag: "High Conversion"
              },
            ].map((template) => (
              <Card key={template.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {template.tag}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <div>
                    <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Headline</p>
                    <p className="text-sm">{template.headline}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{template.body}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleCopy(template.id, `${template.headline}\n\n${template.body}`)}
                  >
                    {copied === template.id ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Template
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="meta">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "m1",
                title: "Instagram Story Template",
                description: "Visual-first template with strong CTA",
                imagePrompt: "A minimalist lifestyle image showing a person using a laptop in a bright, modern coffee shop with subtle product placement",
                caption: "Transform how you [benefit] with our innovative [product]. 🚀\n\nNo more [pain point] - just pure [benefit].\n\n✅ [Feature 1]\n✅ [Feature 2]\n✅ [Feature 3]\n\nOur customers are seeing [specific result] - tap the link in bio to join them! 🔗\n\n#[industry] #[benefit] #[related topic]",
                tag: "High Engagement"
              },
              {
                id: "m2",
                title: "Facebook Feed Template",
                description: "Engagement-optimized with question hook",
                imagePrompt: "A clean before/after comparison showing the transformation your product/service provides, with clear visual results",
                caption: "Ever wondered how some [people/businesses] achieve [desired outcome] so easily? 🤔\n\nThe secret? Our [product/service] that helps you [benefit] without [pain point].\n\nJust ask [customer name], who experienced [specific result] in just [timeframe]!\n\n👉 [Call to action] - Limited [offer/discount] available now.\n\nDrop a ❤️ if you want to [achieve benefit] too!",
                tag: "High Conversion"
              },
            ].map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {template.tag}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Image Prompt</p>
                    <div className="p-3 bg-muted/30 rounded-md text-sm">
                      {template.imagePrompt}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Caption</p>
                    <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-line">
                      {template.caption}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleCopy(template.id, `Image Prompt:\n${template.imagePrompt}\n\nCaption:\n${template.caption}`)}
                  >
                    {copied === template.id ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Template
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">LinkedIn Professional Template</CardTitle>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  High Engagement
                </Badge>
              </div>
              <CardDescription>
                B2B-focused template with professional tone and clear value proposition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Headline</p>
                <p className="text-sm font-medium">
                  Boost Your Team's Productivity by [X]% with [Product/Service]
                </p>
              </div>
              
              <div>
                <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Ad Copy</p>
                <div className="p-3 bg-muted/30 rounded-md text-sm whitespace-pre-line">
                  Is your team struggling with [specific challenge]?
                  
                  Over [X] companies like [Recognizable Company] have improved their [key metric] by [percentage/metric] using our [product/service].
                  
                  Our solution helps you:
                  • [Benefit 1]
                  • [Benefit 2]
                  • [Benefit 3]
                  
                  Download our complimentary [resource] to see how you can transform your [department/process] in just [timeframe].
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleCopy("li1", "Headline:\nBoost Your Team's Productivity by [X]% with [Product/Service]\n\nAd Copy:\nIs your team struggling with [specific challenge]?\n\nOver [X] companies like [Recognizable Company] have improved their [key metric] by [percentage/metric] using our [product/service].\n\nOur solution helps you:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\nDownload our complimentary [resource] to see how you can transform your [department/process] in just [timeframe].")}
              >
                {copied === "li1" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Template
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Template Usage Tips</h2>
        </div>
        
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Replace placeholder text with specific details about your product</li>
          <li>Include numbers and statistics to increase credibility</li>
          <li>Adapt the tone to match your brand voice</li>
          <li>Test multiple variations to find what works best</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateExamplePage;
