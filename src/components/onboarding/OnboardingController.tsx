
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import OnboardingModal from "./OnboardingModal";
import WelcomeCreditsModal from "./WelcomeCreditsModal";

const OnboardingController: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeCredits, setShowWelcomeCredits] = useState(false);
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
          .select('onboarding_completed, welcome_credits_seen')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching onboarding status:", error);
          setLoading(false);
          return;
        }
        
        // First, check if they need to see the welcome credits modal
        if (!data.welcome_credits_seen) {
          setShowWelcomeCredits(true);
        }
        // Then, if they haven't completed onboarding, show the onboarding modal
        else if (!data.onboarding_completed) {
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
  
  const handleWelcomeCreditsComplete = async () => {
    if (!user) return;
    
    try {
      // Update the user's welcome_credits_seen flag
      await supabase
        .from('profiles')
        .update({ welcome_credits_seen: true })
        .eq('id', user.id);
        
      setShowWelcomeCredits(false);
      
      // Check if they should now see the onboarding modal
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();
        
      if (!error && data && !data.onboarding_completed) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error updating welcome credits status:", error);
    }
  };
  
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
    <>
      <WelcomeCreditsModal
        open={showWelcomeCredits}
        onOpenChange={setShowWelcomeCredits}
        onContinue={handleWelcomeCreditsComplete}
      />
      
      <OnboardingModal
        open={showOnboarding}
        onOpenChange={(open) => {
          setShowOnboarding(open);
          if (!open) handleOnboardingComplete();
        }}
      />
    </>
  );
};

export default OnboardingController;
