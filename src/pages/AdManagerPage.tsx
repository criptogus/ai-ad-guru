
import React from "react";
import AdManager from "@/components/ads/AdManager";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const AdManagerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-8">You need to be logged in to access the Ad Manager.</p>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  return (
    <AppLayout activePage="ad-manager">
      <AdManager />
    </AppLayout>
  );
};

export default AdManagerPage;
