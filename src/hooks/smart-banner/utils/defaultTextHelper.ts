
// Helper functions to generate default text based on template type
export const getDefaultHeadline = (templateType: string): string => {
  switch (templateType) {
    case "product":
      return "Discover Our Premium Product";
    case "seasonal":
      return "Summer Special Offer";
    case "event":
      return "Join Our Exclusive Event";
    case "brand":
      return "Trust the Industry Leader";
    case "discount":
      return "30% Off Limited Time";
    default:
      return "Your Compelling Headline";
  }
};

export const getDefaultSubheadline = (templateType: string): string => {
  switch (templateType) {
    case "product":
      return "Quality and performance you can rely on";
    case "seasonal":
      return "Celebrate the season with our exclusive deals";
    case "event":
      return "Network with industry experts and pioneers";
    case "brand":
      return "Trusted by thousands of satisfied customers";
    case "discount":
      return "Use code SAVE30 at checkout today";
    default:
      return "Supporting information to convince your audience";
  }
};

export const getDefaultCTA = (templateType: string): string => {
  switch (templateType) {
    case "product":
      return "Shop Now";
    case "seasonal":
      return "Get the Offer";
    case "event":
      return "Register Today";
    case "brand":
      return "Learn More";
    case "discount":
      return "Claim Discount";
    default:
      return "Click Here";
  }
};
