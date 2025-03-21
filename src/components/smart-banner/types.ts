
// Define all the types used in the SmartBanner system
export type BannerFormat = "square" | "horizontal" | "story";
export type BannerPlatform = "instagram" | "linkedin" | "google";

export interface BannerTemplate {
  id: string;
  name: string;
  description: string;
  type: "product" | "seasonal" | "event" | "brand" | "discount";
  previewImageUrl: string;
}

export interface BannerStep {
  id: string;
  title: string;
  description: string;
}
