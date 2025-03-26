
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PromptTemplateProps {
  onSelectPrompt: (prompt: string) => void;
}

const AdvancedPromptTemplates: React.FC<PromptTemplateProps> = ({ onSelectPrompt }) => {
  const promptCategories = [
    { id: "urgency", name: "Urgency & Scarcity" },
    { id: "personal", name: "Personal Branding" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "education", name: "Education" },
    { id: "hiring", name: "Hiring & Employer" },
    { id: "fintech", name: "Fintech" },
    { id: "social", name: "Social Engagement" }
  ];

  const promptTemplates = {
    urgency: [
      {
        title: "Flash Countdown",
        description: "Create an Instagram ad image and caption using a countdown-style urgency. Include bold text like 'Ends in 3h!' and highlight a time-sensitive offer for [INSERT PRODUCT or SERVICE]. Style: modern, clean, bold."
      },
      {
        title: "Low Stock",
        description: "Generate an Instagram ad showing a popular product with a 'Only 3 Left' urgency message. Include realistic product imagery and a minimalist text overlay to drive FOMO."
      },
      {
        title: "Weekend Sale",
        description: "Create a promo image for a weekend sale. Include text: '20% off until Sunday!' and a clean product display. Style: vibrant but trustworthy."
      },
      {
        title: "Early Bird",
        description: "Design an ad for early bird registration with a clear message like 'Reserve Now and Save'. Use optimistic tones and limited-time visuals."
      },
      {
        title: "Happy Hour",
        description: "Create a happy hour-themed ad showing deals valid from 2–5pm. Use time-based icons and a high-contrast, fast-action design."
      }
    ],
    personal: [
      {
        title: "Free Guide",
        description: "Create an ad that promotes a downloadable guide from a creator. Use the phrase 'Download my growth plan' and a clean, personal photo with bold CTA button."
      },
      {
        title: "Webinar Promo",
        description: "Generate a webinar promotion ad with a headline 'Live This Thursday'. Include a host image and minimal but powerful overlay text."
      },
      {
        title: "Testimonial",
        description: "Create a testimonial-style ad with a quote: 'This changed how I work.' Use a profile photo and stylized quote graphic."
      },
      {
        title: "Poll",
        description: "Create an interactive-feel image that visually simulates a poll with two options, e.g., A or B. Style it like a carousel or question card."
      },
      {
        title: "Before & After",
        description: "Generate an ad showing a 'before and after' visual transformation. Use split screen design and realistic lifestyle imagery."
      }
    ],
    ecommerce: [
      {
        title: "Product Carousel",
        description: "Create a carousel preview image with 3–5 featured products and text 'Swipe to Shop the Collection'. Use real product mockups."
      },
      {
        title: "Price Drop",
        description: "Design an ad showing a product with price drop: 'Now $49 (was $79)'. Use contrast and badge design to emphasize savings."
      },
      {
        title: "VIP Deal",
        description: "Generate an ad promoting an exclusive deal for members: 'Members Save 30%'. Use dark/light luxury theme."
      },
      {
        title: "Back in Stock",
        description: "Create a 'Back by Popular Demand' announcement image. Highlight the product and add a minimal background."
      },
      {
        title: "Best Sellers",
        description: "Showcase a top-selling product with badge or text overlay: '#1 Choice by 5,000+ Customers'."
      }
    ],
    education: [
      {
        title: "Course Launch",
        description: "Create an education ad announcing a new course with the headline 'Learn AI in 30 Days'. Show a classroom or tech-learning setting."
      },
      {
        title: "Free Trial",
        description: "Generate a signup ad promoting a free trial with 'Try Free. No Credit Card.' in bold, centered text."
      },
      {
        title: "Certification",
        description: "Design an ad promoting certification: 'Get Certified Fast'. Use certificate mockups or graduate-style visuals."
      },
      {
        title: "Tutor Match",
        description: "Create a tutor-matching service ad with 'Top Tutors in 24 Hours'. Use mentor-student imagery."
      },
      {
        title: "Student Story",
        description: "Make a student success story ad. Use text like 'How I landed my dream job' and a natural, trustworthy image."
      }
    ],
    hiring: [
      {
        title: "We're Hiring",
        description: "Generate a hiring ad with text 'Join Our Remote Team'. Include visuals of people working from home."
      },
      {
        title: "Meet the Team",
        description: "Create a collage or profile card-style ad that introduces the team with quote overlays."
      },
      {
        title: "Referral Bonus",
        description: "Ad promoting a referral program: 'Refer a Friend and Earn $100'. Use clear CTA and positive reward symbols."
      },
      {
        title: "Company Perks",
        description: "Design a modern job ad with perks like 'Remote. Flexible. Balanced.' Include lifestyle imagery."
      },
      {
        title: "Life at Work",
        description: "Show real office moments or team culture with caption 'We build cool things, together.'"
      }
    ],
    fintech: [
      {
        title: "Cashback Offer",
        description: "Ad promoting a financial product: 'Get 10% Cashback This Month'. Use a card design and benefit overlay."
      },
      {
        title: "Savings Goal",
        description: "Create a visual that tracks a savings goal with 'You're 85% There!'. Use progress bar design."
      },
      {
        title: "Credit Score",
        description: "Generate an ad showing score boost: 'Boost Your Score Fast'. Use clean credit dashboard mockups."
      },
      {
        title: "Smart Tip",
        description: "Create a tip/advice post with caption 'Pay Yourself First'. Design as a quote card or infographic."
      },
      {
        title: "Fintech Launch",
        description: "Design a product launch visual: 'Now Available in 🇧🇷 Brazil'. Use branded tech UI imagery."
      }
    ],
    social: [
      {
        title: "Tag a Friend",
        description: "Design a social engagement post that invites users to tag friends. Use playful layout and large emoji."
      },
      {
        title: "Quote Inspiration",
        description: "Create a clean inspiration quote card with 'Success = Consistency'. Use bold text on soft gradient background."
      },
      {
        title: "Challenge",
        description: "Design a '7-Day Reset Challenge' ad. Use checklist or day-by-day layout."
      },
      {
        title: "This or That",
        description: "Create a comparison card: 'Dark Mode ☑️ Light Mode ⬜️'. Use visual toggles."
      },
      {
        title: "Viral Hook",
        description: "Generate a mysterious teaser ad with the caption 'You won't believe this AI ad…'. Use visual intrigue."
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Advanced Ad Prompt Templates
        </CardTitle>
        <CardDescription>
          Select a template to use as your ad prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="urgency">
          <TabsList className="w-full flex flex-wrap mb-4">
            {promptCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {promptCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-3">
              {promptTemplates[category.id as keyof typeof promptTemplates].map((template, index) => (
                <div key={index} className="border rounded-md p-3 hover:bg-accent/50">
                  <h4 className="font-medium">{template.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{template.description}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSelectPrompt(template.description)}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedPromptTemplates;
