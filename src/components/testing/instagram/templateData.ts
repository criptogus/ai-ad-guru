
export const categories = [
  { id: "product", name: "Product Showcase", emoji: "✨" },
  { id: "promotion", name: "Promotions", emoji: "🔥" },
  { id: "lifestyle", name: "Lifestyle", emoji: "🌈" },
  { id: "testimonial", name: "Testimonials", emoji: "💬" },
  { id: "announcement", name: "Announcements", emoji: "📣" },
  { id: "educational", name: "Educational", emoji: "📚" }
];

export const templates = [
  {
    id: "prod-1",
    title: "Clean Product Display",
    category: "product",
    prompt: "A professional product photography with clean white background, showing all details clearly",
    hasVariables: false
  },
  {
    id: "prod-2",
    title: "Lifestyle Product",
    category: "product",
    prompt: "A product being used naturally in a lifestyle setting with soft natural lighting",
    hasVariables: false
  },
  {
    id: "prod-3",
    title: "Product Close-up",
    category: "product",
    prompt: "An extreme close-up of the product showing texture and quality details",
    hasVariables: false
  },
  {
    id: "promo-1",
    title: "Limited Time Offer",
    category: "promotion",
    prompt: "A vibrant promotional graphic showing a limited time offer with a countdown element",
    hasVariables: true
  },
  {
    id: "promo-2",
    title: "Discount Badge",
    category: "promotion",
    prompt: "A bold graphic showing percentage off with striking colors and attention-grabbing text",
    hasVariables: true
  },
  {
    id: "life-1",
    title: "Urban Lifestyle",
    category: "lifestyle",
    prompt: "A trendy urban setting with people enjoying life with the product or service",
    hasVariables: false
  },
  {
    id: "life-2",
    title: "Family Moments",
    category: "lifestyle",
    prompt: "A warm family setting showing happiness and connection related to the product",
    hasVariables: false
  },
  {
    id: "test-1",
    title: "Customer Quote",
    category: "testimonial",
    prompt: "A well-designed quote card with customer testimonial and rating stars",
    hasVariables: true
  },
  {
    id: "announce-1",
    title: "New Launch",
    category: "announcement",
    prompt: "An exciting announcement graphic for a new product or service launch",
    hasVariables: true
  },
  {
    id: "edu-1",
    title: "How-To Guide",
    category: "educational",
    prompt: "Step-by-step visual guide showing how to use a product or service",
    hasVariables: true
  },
  {
    id: "edu-2",
    title: "Did You Know",
    category: "educational",
    prompt: "An informative graphic sharing an interesting fact about your industry or product",
    hasVariables: true
  }
];
