
import { BannerTemplate, BannerFormat, BannerPlatform } from "@/components/smart-banner/SmartBannerBuilder";

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
