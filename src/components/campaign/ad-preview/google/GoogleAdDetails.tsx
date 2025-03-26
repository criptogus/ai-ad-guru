
import React, { useState, useEffect } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

  const handleChange = (field: keyof GoogleAd, value: string) => {
    setLocalAd((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    onUpdate(localAd);
  }, [localAd, onUpdate]);

  const handleInsertTrigger = (field: keyof GoogleAd, trigger: string) => {
    insertTrigger(
      trigger, 
      field.toString(), 
      localAd[field] as string, 
      (fieldName, value) => handleChange(fieldName as keyof GoogleAd, value)
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headline 1</label>
          {isEditing && (
            <div className="flex items-center">
              <CharacterCountIndicator text={localAd.headline1} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline1', trigger)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline1"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headline1}
                onChange={(e) => handleChange("headline1", e.target.value)}
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
              <CharacterCountIndicator text={localAd.headline2} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline2', trigger)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline2"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headline2}
                onChange={(e) => handleChange("headline2", e.target.value)}
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
              <CharacterCountIndicator text={localAd.headline3} limit={30} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('headline3', trigger)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="headline3"
          render={({ field }) => (
            <FormControl>
              <Input
                value={localAd.headline3}
                onChange={(e) => handleChange("headline3", e.target.value)}
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
              <CharacterCountIndicator text={localAd.description1} limit={90} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('description1', trigger)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="description1"
          render={({ field }) => (
            <FormControl>
              <Textarea
                value={localAd.description1}
                onChange={(e) => handleChange("description1", e.target.value)}
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
              <CharacterCountIndicator text={localAd.description2} limit={90} />
              <TriggerButtonInline onInsert={(trigger) => handleInsertTrigger('description2', trigger)} />
            </div>
          )}
        </div>
        <FormField
          control={{} as any}
          name="description2"
          render={({ field }) => (
            <FormControl>
              <Textarea
                value={localAd.description2}
                onChange={(e) => handleChange("description2", e.target.value)}
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
            value={localAd.path1}
            onChange={(e) => handleChange("path1", e.target.value)}
            placeholder="path1"
            readOnly={!isEditing}
            className={`w-24 ${!isEditing ? "bg-muted" : ""}`}
          />
          <span className="text-muted-foreground mx-1">/</span>
          <Input
            value={localAd.path2}
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
