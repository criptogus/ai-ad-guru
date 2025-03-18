
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Cta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Ad Campaigns?</h2>
        <p className="text-xl mb-8">
          Get started today and see the difference AI can make for your business.
        </p>
        <Button
          size="lg"
          className="text-lg px-8 bg-white text-brand-700 hover:bg-gray-100"
          onClick={() => navigate("/register")}
        >
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
};
