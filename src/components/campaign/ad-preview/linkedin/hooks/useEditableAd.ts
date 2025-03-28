
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { useFormContext } from "react-hook-form";

interface UseEditableAdProps {
  ad: MetaAd;
  externalIsEditing?: boolean;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  onEdit?: () => void;
  onSave?: (updatedAd: MetaAd) => void;
  onCancel?: () => void;
  onCopy?: () => void;
  index: number;
}

export const useEditableAd = ({
  ad,
  externalIsEditing,
  onUpdateAd,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  index
}: UseEditableAdProps) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  const formMethods = useFormContext();
  
  // Use external editing state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      const adText = `Headline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nDescription: ${ad.description}`;
      navigator.clipboard.writeText(adText);
    }
  };

  const handleEditToggle = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalIsEditing(!internalIsEditing);
      // Reset to original if canceling edit
      if (internalIsEditing) {
        setEditedAd(ad);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedAd);
    } else if (onUpdateAd) {
      onUpdateAd(editedAd);
      setInternalIsEditing(false);
      
      // Update the form context if available
      if (formMethods) {
        const linkedInAds = formMethods.getValues("linkedInAds") || [];
        if (linkedInAds.length > index) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = editedAd;
          formMethods.setValue("linkedInAds", updatedAds);
        }
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalIsEditing(false);
      setEditedAd(ad);
    }
  };

  const handleChange = (field: keyof MetaAd, value: string) => {
    setEditedAd(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    isEditing,
    editedAd,
    handleCopy,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleChange
  };
};
