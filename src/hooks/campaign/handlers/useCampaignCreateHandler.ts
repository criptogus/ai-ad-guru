
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UseCampaignCreateHandlerParams {
  createCampaign?: any;
  setIsCreating?: (isCreating: boolean) => void;
}

export const useCampaignCreateHandler = ({
  createCampaign,
  setIsCreating,
}: UseCampaignCreateHandlerParams) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateCampaign = async (): Promise<void> => {
    if (setIsCreating) {
      setIsCreating(true);
    }

    try {
      if (createCampaign) {
        const result = await createCampaign();
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
