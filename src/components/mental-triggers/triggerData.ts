
export type TriggerCategory = {
  label: string;
  triggers: string[];
};

export type TriggerDataType = {
  [key: string]: TriggerCategory;
};

export const triggerData: TriggerDataType = {
  urgency: {
    label: "Urgency & Scarcity",
    triggers: [
      "Only a few hours left to grab this deal!",
      "Limited spots available – act fast!",
      "This weekend only – save 25% today!",
      "Ends tonight at midnight!",
      "Going fast – don't miss out!"
    ]
  },
  personal: {
    label: "Personal Branding",
    triggers: [
      "Join over 20,000 creators using this tool.",
      "Download the exact template I used to grow my audience.",
      "Learn the system I built to scale my business.",
      "Live training with real Q&A – seats are limited!",
      "Here's what changed everything for me..."
    ]
  },
  ecommerce: {
    label: "E-commerce & Retail",
    triggers: [
      "Our best-selling product is now 20% off!",
      "Customers are loving this – 1,000+ 5-star reviews!",
      "Back in stock: Get yours before it's gone again.",
      "Bundle up and save – build your own pack.",
      "Free shipping for the next 24h only."
    ]
  },
  education: {
    label: "Education & EdTech",
    triggers: [
      "Learn in-demand skills in just 30 days.",
      "No fluff. Just real, practical knowledge.",
      "Get certified and boost your career.",
      "Thousands of students trust us – join now.",
      "Start learning free. Cancel anytime."
    ]
  },
  hiring: {
    label: "Hiring & Employer Branding",
    triggers: [
      "Work from anywhere. Grow from everywhere.",
      "Join a culture that values people and progress.",
      "We're hiring changemakers.",
      "Help us build the future of [industry].",
      "Top-rated on Glassdoor."
    ]
  },
  finance: {
    label: "Finance & Fintech",
    triggers: [
      "Earn rewards on every purchase.",
      "Smarter saving starts here.",
      "Your money. Your rules.",
      "No hidden fees. Ever.",
      "Trusted by 1M+ users worldwide."
    ]
  },
  social: {
    label: "Social & Engagement",
    triggers: [
      "Tag someone who needs this!",
      "You won't believe this simple hack...",
      "Vote now – what would you choose?",
      "We asked 100 people and here's what they said.",
      "Seen by over 1M people last week."
    ]
  }
};
