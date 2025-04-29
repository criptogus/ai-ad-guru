
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Gift, Check, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";

interface CreditsPurchaseCardProps {
  userId?: string;
  currentCredits: number;
}

const CreditsPurchaseCard: React.FC<CreditsPurchaseCardProps> = ({ userId, currentCredits }) => {
  const { toast: uiToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPack, setProcessingPack] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const { refreshCredits } = useCredits();
  const [hasClaimedFreeCredits, setHasClaimedFreeCredits] = useState<boolean>(
    user?.receivedFreeCredits || false
  );

  const loadingUser = !user || typeof currentCredits !== "number";

  useEffect(() => {
    if (user?.receivedFreeCredits) {
      setHasClaimedFreeCredits(true);
    }

    const checkClaimStatus = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('received_free_credits, credits')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error checking free credits status:", error);
          if (error.message.includes("column profiles.received_free_credits does not exist")) {
            setHasClaimedFreeCredits(false);
          }
          return;
        }
        
        setHasClaimedFreeCredits(!!data?.received_free_credits);
      } catch (err) {
        console.error("Unexpected error checking claim status:", err);
      }
    };
    
    checkClaimStatus();
  }, [user, userId]);

  const handleClaimFreeCredits = async () => {
    if (!userId) {
      uiToast({
        title: "Error",
        description: "You need to be logged in to claim free credits",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProcessingPack('free');

      const { data, error } = await supabase.functions.invoke("claim-free-credits", {
        body: { userId, creditsToAdd: 15 },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        toast.success("Success!", {
          description: `${data.creditsAdded || 15} free credits have been added to your account`
        });

        setHasClaimedFreeCredits(true);
        await refreshUser();
        await refreshCredits();
      } else {
        throw new Error(data?.message || "Failed to claim free credits");
      }
    } catch (error) {
      console.error('Error claiming free credits:', error);
      toast.error("Failed to Claim Credits", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
      setProcessingPack(null);
    }
  };

  const handlePurchaseClick = async (amount: number, price: number, packId: string) => {
    if (!userId) {
      uiToast({
        title: "Error",
        description: "You need to be logged in to purchase credits",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingPack(packId);

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

      localStorage.setItem('credit_purchase_intent', JSON.stringify({
        amount,
        timestamp: Date.now(),
        sessionId: data.sessionId,
      }));

      window.location.href = data.url;

    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Purchase Failed", {
        description: error instanceof Error ? error.message : "Failed to create checkout session"
      });
    } finally {
      setIsProcessing(false);
      setProcessingPack(null);
    }
  };

  if (loadingUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Credits...</CardTitle>
          <CardDescription>Please wait while we load your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>
          You currently have <strong>{currentCredits}</strong> credits available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="credits">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="credits">Credit Packs</TabsTrigger>
          </TabsList>
          <TabsContent value="credits" className="mt-4">
            <div className="mb-6">
              <Card className={`relative border-2 ${!hasClaimedFreeCredits ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-gray-200 bg-gray-100/50 dark:bg-gray-800/50"}`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs py-1 px-4 rounded-full font-medium">
                  FREE CREDITS
                </div>
                <CardContent className="pt-6 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">15 Free Credits</h3>
                    <p className="text-sm text-muted-foreground mt-1">Start creating AI ads without paying</p>
                    <ul className="space-y-1 mt-2 text-sm">
                      <li className="flex items-center">
                        <div className="mr-2 h-4 w-4 text-green-500">✓</div>
                        <span>Create ~3 Google ads</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-4 w-4 text-green-500">✓</div>
                        <span>Generate ~3 Instagram images</span>
                      </li>
                    </ul>
                  </div>
                  <Button 
                    className="h-10 px-4"
                    onClick={handleClaimFreeCredits}
                    disabled={isProcessing || hasClaimedFreeCredits}
                    variant={hasClaimedFreeCredits ? "outline" : "default"}
                  >
                    {isProcessing && processingPack === 'free' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : hasClaimedFreeCredits ? (
                      <>
                        <div className="mr-2 h-4 w-4">✓</div>
                        Already Claimed
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Claim Free
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Diretamente renderizando os pacotes sem usar PackCard */}
            <div className="grid gap-4 md:grid-cols-3">
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
