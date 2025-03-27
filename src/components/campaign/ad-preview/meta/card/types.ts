
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export interface MetaAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  isEditing: boolean;
  isGeneratingImage: boolean;
  loadingImageIndex: number | null;
  onEdit: () => void;
  onSave: (updatedAd: MetaAd) => void;
  onCancel: () => void;
  onCopy: () => void;
  onGenerateImage: () => Promise<void>;
  onUpdate?: (updatedAd: MetaAd) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export interface PreviewSectionProps {
  ad: MetaAd;
  companyName: string;
  isGeneratingImage: boolean;
  index: number;
  loadingImageIndex: number | null;
  onGenerateImage: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
}

export interface EditorSectionProps {
  ad: MetaAd;
  isEditing: boolean;
  onUpdate: (updatedAd: MetaAd) => void;
  onSelectTrigger?: (trigger: string) => void;
}
