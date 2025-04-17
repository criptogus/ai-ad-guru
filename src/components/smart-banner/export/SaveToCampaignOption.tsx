
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { consumeCredits } from "@/services/credits/creditUsage";
import { getCreditCost } from "@/services/credits/creditCosts";
import { CreditAction } from "@/services/credits/types";

interface SaveToCampaignOptionProps {
  backgroundImage: string | null;
  platform: string;
  format: string;
}

const SaveToCampaignOption: React.FC<SaveToCampaignOptionProps> = ({
  backgroundImage,
  platform,
  format
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const creditCost = getCreditCost("smartBanner");

  const handleSaveToCampaign = async () => {
    if (!user || !backgroundImage) return;
    
    setIsSaving(true);
    try {
      const creditSuccess = await consumeCredits(
        user.id,
        creditCost,
        "smartBanner" as CreditAction,
        `Smart Banner - ${platform} ${format}`
      );
      
      if (!creditSuccess) {
        toast.error("Insufficient credits", {
          description: "You don't have enough credits to save this banner"
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast.success("Banner saved to campaign", {
        description: "Your banner has been added to your campaign assets"
      });
      
      setTimeout(() => {
        navigate("/campaigns");
      }, 1500);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-md p-4 hover:bg-gray-50 transition cursor-pointer">
      <div className="flex items-start gap-3">
        <Save className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary" />
        <div>
          <h4 className="text-sm font-medium">Save to Current Campaign</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Add this banner to your current campaign
          </p>
          <Button
            onClick={handleSaveToCampaign}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save to Campaign ({creditCost} credits)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveToCampaignOption;
