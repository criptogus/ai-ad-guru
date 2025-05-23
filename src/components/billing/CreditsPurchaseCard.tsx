import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreditsPurchaseCardProps {
  userId?: string;
  currentCredits: number;
}

const CreditsPurchaseCard: React.FC<CreditsPurchaseCardProps> = ({ userId, currentCredits }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPack, setProcessingPack] = useState<string | null>(null);
  
  const handlePurchaseClick = async (amount: number, price: number, packId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You need to be logged in to purchase credits",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProcessingPack(packId);
      
      // Create a checkout session via edge function
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          userId,
          planId: packId,
          returnUrl: `${window.location.origin}/billing?success=true`,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data?.url) {
        throw new Error("Failed to create checkout session");
      }
      
      // Store purchase intent in localStorage
      localStorage.setItem('credit_purchase_intent', JSON.stringify({
        amount,
        timestamp: Date.now(),
        sessionId: data.sessionId,
      }));
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingPack(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          Buy credits to use for AI-generated ad campaigns, image generation, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="credits">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="credits">Credit Packs</TabsTrigger>
          </TabsList>
          <TabsContent value="credits" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Starter Pack */}
              <Card className="relative border-2 hover:border-primary/50">
                <CardHeader>
                  <CardTitle>100 Credits</CardTitle>
                  <CardDescription>Starter pack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">$15</div>
                  <div className="text-sm text-muted-foreground">15¢ per credit</div>
                  <ul className="space-y-2 mt-4 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Create ~20 Google ads</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Generate ~20 Instagram images</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handlePurchaseClick(100, 15, 'starter')}
                    disabled={isProcessing}
                  >
                    {isProcessing && processingPack === 'starter' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Buy Credits
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Pack */}
              <Card className="relative border-2 border-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-3 rounded-full">
                  MOST POPULAR
                </div>
                <CardHeader>
                  <CardTitle>500 Credits</CardTitle>
                  <CardDescription>Popular pack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">$50</div>
                  <div className="text-sm text-muted-foreground">10¢ per credit</div>
                  <ul className="space-y-2 mt-4 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Create ~100 Google ads</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Generate ~100 Instagram images</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>33% discount vs starter pack</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handlePurchaseClick(500, 50, 'pro')}
                    disabled={isProcessing}
                  >
                    {isProcessing && processingPack === 'pro' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Buy Credits
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Pack */}
              <Card className="relative border-2 hover:border-primary/50">
                <CardHeader>
                  <CardTitle>2000 Credits</CardTitle>
                  <CardDescription>Professional pack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">$150</div>
                  <div className="text-sm text-muted-foreground">7.5¢ per credit</div>
                  <ul className="space-y-2 mt-4 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Create ~400 Google ads</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Generate ~400 Instagram images</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>50% discount vs starter pack</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handlePurchaseClick(2000, 150, 'agency')}
                    disabled={isProcessing}
                  >
                    {isProcessing && processingPack === 'agency' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Buy Credits
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreditsPurchaseCard;
