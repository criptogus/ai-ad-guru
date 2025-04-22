
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad, companyName }) => {
  const ensureCompleteText = (text: string): string => {
    if (!text) return "";
    const trimmed = text.trim();
    return /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + ".";
  };

  const getHashtags = (): string => {
    if (!ad.hashtags) return "";
    if (typeof ad.hashtags === "string") return ad.hashtags;
    if (Array.isArray(ad.hashtags)) {
      return ad.hashtags
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
        .join(" ");
    }
    return "";
  };

  const caption = ensureCompleteText(ad.primaryText || "");
  const hashtags = getHashtags();

  const fullCaption = [caption, hashtags].filter(Boolean).join("\n\n");

  if (!fullCaption) return null;

  const [previewCaption, ...rest] = fullCaption.split("\n\n");

  return (
    <div className="mt-2 text-sm leading-snug text-gray-900">
      <div className="font-semibold">{companyName}</div>
      <div className="whitespace-pre-line">
        {previewCaption}
        {rest.length > 0 && (
          <span className="text-gray-500 ml-1">... mais</span>
        )}
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;
