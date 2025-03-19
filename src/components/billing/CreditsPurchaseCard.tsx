
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const CreditsPurchaseCard: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Buy Additional Credits</CardTitle>
        <CardDescription>
          Add more credits to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <Plus className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">200 Credits</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Create additional campaigns
              </li>
              <li className="flex items-center text-sm">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Generate more AI ad variations
              </li>
              <li className="flex items-center text-sm">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                One-time purchase (no subscription)
              </li>
            </ul>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold">$49.99</p>
              <p className="text-muted-foreground text-sm">one-time payment</p>
            </div>
            <Button 
              className="w-full"
              onClick={() => window.open("https://buy.stripe.com/dR62brdyV4jR1XO7sv", "_blank")}
            >
              Buy Credits
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsPurchaseCard;
