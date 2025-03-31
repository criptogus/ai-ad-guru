
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import { googleAdsApi } from "@/services/ads/google/googleAdsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface GoogleAdsAccount {
  id: string;
  resourceName: string;
}

const GoogleAdsAccountsList: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const accountsList = await googleAdsApi.listAccessibleAccounts(user.id);
      setAccounts(accountsList);
      
      if (accountsList.length === 0) {
        setError("No Google Ads accounts found. Make sure you have access to a Google Ads account.");
      }
    } catch (err: any) {
      console.error("Error fetching Google Ads accounts:", err);
      setError(err.message || "Failed to load Google Ads accounts");
      toast.error("Failed to load Google Ads accounts", {
        description: "There was a problem retrieving your Google Ads accounts. Please verify your connection."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Google Ads Accounts</CardTitle>
          <CardDescription>
            Linked Google Ads accounts available for campaign management
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchAccounts}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Account Access Issue</h3>
                <p className="text-sm mt-1">{error}</p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={fetchAccounts}>
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center p-6 border rounded-md">
            <p className="text-muted-foreground">No Google Ads accounts found</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => window.open("https://ads.google.com/home/", "_blank")}
            >
              Create Google Ads Account
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="flex justify-between items-center p-3 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="font-medium">Account ID: {account.id}</div>
                  <div className="text-sm text-muted-foreground">{account.resourceName}</div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdsAccountsList;
