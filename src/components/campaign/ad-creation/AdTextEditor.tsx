
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TriggerButtonInline from "../ad-preview/TriggerButtonInline";
import { useMindTriggers } from "@/hooks/useMindTriggers";

// Rest of your component code

// Example of using TriggerButtonInline with onInsert
const TriggerInsertExample = ({ onInsert }: { onInsert: (text: string) => void }) => (
  <TriggerButtonInline 
    onSelectTrigger={onInsert} 
    onInsert={onInsert} 
  />
);

export default AdTextEditor;
