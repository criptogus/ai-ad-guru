
import React from "react";
import { AdPlatform } from "@/hooks/adConnections/types";
import { Facebook, Linkedin, Globe } from "lucide-react";

interface PlatformIconProps {
  platform: AdPlatform;
  size?: number;
  className?: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  size = 20, 
  className = "" 
}) => {
  switch (platform) {
    case "google":
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          className={className}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" fill="rgba(66, 133, 244, 0.15)" />
          <path d="M12 6v12M6 12h12" stroke="#4285F4" strokeWidth="2" />
        </svg>
      );
    case "meta":
      return <Facebook size={size} className={className} />;
    case "linkedin":
      return <Linkedin size={size} className={className} />;
    case "microsoft":
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          className={className}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      );
    default:
      return <Globe size={size} className={className} />;
  }
};

export default PlatformIcon;
