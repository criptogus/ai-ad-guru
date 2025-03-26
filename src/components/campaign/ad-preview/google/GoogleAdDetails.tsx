
import React, { useState, useEffect } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CharacterCountIndicator from "../CharacterCountIndicator";
import TriggerButtonInline from "../TriggerButtonInline";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";

interface GoogleAdDetailsProps {
  ad: GoogleAd;
  onUpdate: (updatedAd: GoogleAd) => void;
  isEditing: boolean;
}

const GoogleAdDetails: React.FC<GoogleAdDetailsProps> = ({
  ad,
  onUpdate,
  isEditing,
}) => {
  const [localAd, setLocalAd] = useState<GoogleAd>(ad);
  const { insertTrigger } = useMentalTriggers();

  useEffect(() => {
    setLocalAd(ad);
  }, [ad]);

  const handleChange = (field: string, value: string, index?: number) => {
    setLocalAd((prev) => {
      const updatedAd = { ...prev };
      
      if (field.startsWith('headline') && index !== undefined) {
        const headlines = [...prev.headlines];
        headlines[index] = value;
        updatedAd.headlines = headlines;
      } else if (field.startsWith('description') && index !== undefined) {
        const descriptions = [...prev.descriptions];
        descriptions[index] = value;
        updatedAd.descriptions = descriptions;
      } else if (field === 'path1') {
        updatedAd.displayPath = `${value}/${prev.displayPath?.split('/')[1] || ''}`;
      } else if (field === 'path2') {
        updatedAd.displayPath = `${prev.displayPath?.split('/')[0] || ''}/${value}`;
      } else {
        (updatedAd as any)[field] = value;
      }
      
      return updatedAd;
    });
  };

  const getPathParts = () => {
    const path = localAd.displayPath || '';
    const parts = path.split('/');
    return {
      path1: parts[0] || '',
      path2: parts[1] || ''
    };
  };

  const { path1, path2 } = getPathParts();

  useEffect(() => {
    onUpdate(localAd);
  }, [localAd, onUpdate]);

  const handleInsertTrigger = (field: string, trigger: string, index?: number) => {
    if (field.startsWith('headline') && index !== undefined) {
      const value = localAd.headlines[index] || '';
      insertTrigger(
        trigger, 
        field, 
        value, 
        (fieldName, updatedValue) => handleChange(fieldName, updatedValue, index)
      );
    } else if (field.startsWith('description') && index !== undefined) {
      const value = localAd.descriptions[index] || '';
      insertTrigger(
        trigger, 
        field, 
        value, 
        (fieldName, updatedValue) => handleChange(fieldName, updatedValue, index)
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headline 1</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.headlines[0] || ''} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline1', trigger, 0)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline1"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headlines[0] || ''}
                onChange={(e) => handleChange("headline1", e.target.value, 0)}
                placeholder="Enter headline"
                readOnly={!isEditing}
                maxLength={30}
                className={!isEditing ? "bg-muted" : ""}
              />
            </FormControl>
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headline 2</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.headlines[1] || ''} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline2', trigger, 1)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline2"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headlines[1] || ''}
                onChange={(e) => handleChange("headline2", e.target.value, 1)}
                placeholder="Enter headline"
                readOnly={!isEditing}
                maxLength={30}
                className={!isEditing ? "bg-muted" : ""}
              />
            </FormControl>
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headline 3</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.headlines[2] || ''} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline3', trigger, 2)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline3"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headlines[2] || ''}
                onChange={(e) => handleChange("headline3", e.target.value, 2)}
                placeholder="Enter headline"
                readOnly={!isEditing}
                maxLength={30}
                className={!isEditing ? "bg-muted" : ""}
              />
            </FormControl>
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description 1</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.descriptions[0] || ''} limit={90} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('description1', trigger, 0)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="description1"
          render={({ field }) => (
            <FormControl>
              <Textarea
                value={localAd.descriptions[0] || ''}
                onChange={(e) => handleChange("description1", e.target.value, 0)}
                placeholder="Enter description"
                readOnly={!isEditing}
                maxLength={90}
                className={`resize-none h-20 ${!isEditing ? "bg-muted" : ""}`}
              />
            </FormControl>
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description 2</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.descriptions[1] || ''} limit={90} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('description2', trigger, 1)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="description2"
          render={({ field }) => (
            <FormControl>
              <Textarea
                value={localAd.descriptions[1] || ''}
                onChange={(e) => handleChange("description2", e.target.value, 1)}
                placeholder="Enter description"
                readOnly={!isEditing}
                maxLength={90}
                className={`resize-none h-20 ${!isEditing ? "bg-muted" : ""}`}
              />
            </FormControl>
          )}
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium">Path</label>
        <div className="flex items-center">
          <span className="text-muted-foreground mr-1">example.com/</span>
          <Input
            value={path1}
            onChange={(e) => handleChange("path1", e.target.value)}
            placeholder="path1"
            readOnly={!isEditing}
            className={`w-24 ${!isEditing ? "bg-muted" : ""}`}
          />
          <span className="text-muted-foreground mx-1">/</span>
          <Input
            value={path2}
            onChange={(e) => handleChange("path2", e.target.value)}
            placeholder="path2"
            readOnly={!isEditing}
            className={`w-24 ${!isEditing ? "bg-muted" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleAdDetails;
