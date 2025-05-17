import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Definição das variantes do componente usando class-variance-authority
const statusIndicatorVariants = cva(
  "flex items-center gap-2 rounded-md p-3 text-sm",
  {
    variants: {
      variant: {
        loading: "bg-muted text-muted-foreground",
        error: "bg-destructive/15 text-destructive",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        info: "bg-info/15 text-info",
      },
      size: {
        sm: "text-xs py-1 px-2",
        md: "text-sm py-2 px-3",
        lg: "text-base py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

// Interface de props do componente
export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  message: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Componente StatusIndicator
 * 
 * Exibe indicadores visuais para diferentes estados (carregamento, erro, sucesso, etc.)
 * com mensagens personalizadas e ícones.
 */
export const StatusIndicator = ({
  className,
  variant,
  size,
  message,
  isLoading,
  icon,
  ...props
}: StatusIndicatorProps) => {
  // Determina o ícone com base na variante, se não for fornecido explicitamente
  const getIcon = () => {
    if (icon) return icon;
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    
    switch (variant) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return null;
    }
  };

  // Determina a variante final com base no isLoading
  const finalVariant = isLoading ? 'loading' : variant;

  return (
    <div 
      className={cn(statusIndicatorVariants({ variant: finalVariant, size, className }))}
      {...props}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default StatusIndicator;
