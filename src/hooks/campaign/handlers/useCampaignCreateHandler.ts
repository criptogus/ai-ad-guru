
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UseCampaignCreateHandlerParams {
  createCampaign?: any;
  setIsCreating?: (isCreating: boolean) => void;
  campaignData?: any;
  googleAds?: any[];
  metaAds?: any[];
  microsoftAds?: any[];
  linkedInAds?: any[];
}

export const useCampaignCreateHandler = ({
  createCampaign,
  setIsCreating,
  campaignData = {},
  googleAds = [],
  metaAds = [],
  microsoftAds = [],
  linkedInAds = [],
}: UseCampaignCreateHandlerParams) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateCampaign = async (): Promise<void> => {
    if (setIsCreating) {
      setIsCreating(true);
    }

    try {
      const campaignParams = {
        name: campaignData.name || 'New Campaign',
        description: campaignData.description || '',
        platforms: campaignData.platforms || [],
        budget: campaignData.budget || 100,
        budgetType: campaignData.budgetType || 'daily',
        startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
        endDate: campaignData.endDate,
        targetAudience: campaignData.targetAudience || '',
        objective: campaignData.objective || 'awareness',
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds,
        targetUrl: campaignData.targetUrl || '',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        mindTriggers: campaignData.mindTriggers || {}
      };

      if (createCampaign) {
        const result = await createCampaign(campaignParams);
        if (result) {
          toast({
            title: "Campaign Created",
            description: "Your campaign has been created successfully.",
          });
          navigate('/campaigns');
        }
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Failed to create the campaign. Please try again.",
      });
    } finally {
      if (setIsCreating) {
        setIsCreating(false);
      }
    }
  };

  return { handleCreateCampaign };
};
