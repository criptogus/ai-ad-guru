
import React from "react";

const AnalysisInfoBox: React.FC = () => {
  return (
    <div className="bg-muted/50 p-4 rounded-md">
      <h3 className="text-sm font-medium mb-2">How it works:</h3>
      <p className="text-sm text-muted-foreground">
        Our AI will analyze your website to extract key information such as:
      </p>
      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
        <li>• Business description and industry</li>
        <li>• Target audience demographics</li>
        <li>• Key selling points and value propositions</li>
        <li>• Brand tone and messaging style</li>
        <li>• Suggested keywords and call-to-actions</li>
      </ul>
    </div>
  );
};

export default AnalysisInfoBox;
