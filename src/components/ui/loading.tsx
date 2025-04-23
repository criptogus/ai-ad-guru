
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Loading = ({ size = "md", className, ...props }: LoadingProps) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-4",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin", sizeClass[size])} />
      <p className="mt-2 text-muted-foreground text-sm">Carregando...</p>
    </div>
  );
};
