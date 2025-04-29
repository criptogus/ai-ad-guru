
import React from "react";
import { Loader2 } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

const LoadingState: React.FC = () => {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Billing Information</h1>
          <p className="text-gray-600">Please wait while we prepare your subscription options...</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoadingState;
