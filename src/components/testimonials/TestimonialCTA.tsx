
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TestimonialCTA: React.FC = () => {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">🚀 Ready to Transform Your Ads?</h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Join hundreds of businesses that are already scaling their ad performance with AI.
      </p>
      <Link to="/register">
        <Button size="lg" className="font-semibold">
          📢 Start Your Free Trial Today! 🎯
        </Button>
      </Link>
    </section>
  );
};

export default TestimonialCTA;
