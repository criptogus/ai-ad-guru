
import React, { useMemo } from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad, companyName }) => {
  const getHashtagsText = () => {
    if (!ad.hashtags) return "";
    const tags = Array.isArray(ad.hashtags) ? ad.hashtags : [ad.hashtags];
    return tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  const ensureCompleteText = (text: string): string => {
    if (!text) return "";
    const trimmed = text.trim();
    return /[.!?;:…🤩🔥💥]$/.test(trimmed) ? trimmed : trimmed + ".";
  };

  const getCaption = () => {
    const caption = ensureCompleteText(ad.primaryText || "");
    const hashtags = getHashtagsText();
    if (!caption && !hashtags) return null;
    if (!caption) return hashtags;
    if (!hashtags) return caption;
    return `${caption}\n\n${hashtags}`;
  };

  const caption = useMemo(() => getCaption(), [ad.primaryText, ad.hashtags]);

  if (!caption) return null;

  return (
    <div className="mt-2 text-sm">
      <div>
        <span className="font-semibold">{companyName}</span>{" "}
        <span className="line-clamp-3">
          {caption.split('\n\n')[0]}
        </span>
      </div>
      {caption.includes('\n\n') && (
        <div className="text-gray-500 mt-1">
          mais...
        </div>
      )}
    </div>
  );
};

export default InstagramPreviewFooter;
