
import React from "react";
import { Shield, CircleDollarSign, Sparkles } from "lucide-react";

export const Trust: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is always protected with enterprise-grade security.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <CircleDollarSign className="h-10 w-10 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Hidden Fees</h3>
            <p className="text-gray-600">
              Transparent pricing with no surprise charges.
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-4">
              <Sparkles className="h-10 w-10 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Support</h3>
            <p className="text-gray-600">
              Our team is always available to help with your campaigns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
