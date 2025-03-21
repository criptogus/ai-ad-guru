
// Import types from the components/smart-banner/types.ts file instead of SmartBannerBuilder
import { BannerFormat, BannerPlatform, BannerTemplate } from "@/components/smart-banner/types";

export interface TextElement {
  id: string;
  type: "headline" | "subheadline" | "cta";
  content: string;
}

export interface BannerElement {
  id: string;
  type: "text" | "logo" | "shape";
  content: string;
  x: number;
  y: number;
  zIndex?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  scale?: number;
  width?: string;
  rotation?: number;
}

// Re-export the types for better organization
export type { BannerFormat, BannerPlatform, BannerTemplate };
