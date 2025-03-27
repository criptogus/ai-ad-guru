
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import OnboardingModal from "./OnboardingModal";

const OnboardingController: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Check if the user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Check if the user has the onboarding_completed flag
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching onboarding status:", error);
          setLoading(false);
          return;
        }
        
        // If the user hasn't completed onboarding, show the onboarding modal
        if (!data.onboarding_completed) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Error in onboarding check:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkOnboardingStatus();
  }, [isAuthenticated, user]);
  
  const handleOnboardingComplete = async () => {
    if (!user) return;
    
    try {
      // Update the user's onboarding_completed flag
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
        
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error updating onboarding status:", error);
    }
  };
  
  // Don't render anything while loading
  if (loading) return null;
  
  return (
    <OnboardingModal
      open={showOnboarding}
      onOpenChange={(open) => {
        setShowOnboarding(open);
        if (!open) handleOnboardingComplete();
      }}
    />
  );
};

export default OnboardingController;
