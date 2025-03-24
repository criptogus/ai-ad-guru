
import React from "react";

interface EmptyAdsStateProps {
  platform: string;
}

const EmptyAdsState: React.FC<EmptyAdsStateProps> = ({ platform }) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">No {platform} Ads Created Yet</h3>
      <p className="text-muted-foreground">
        Click the button below to generate {platform} ads based on your website analysis
      </p>
    </div>
  );
};

export default EmptyAdsState;
