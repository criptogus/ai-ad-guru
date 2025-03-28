
import { toast as sonnerToast } from "sonner";

// Re-export toast from sonner
export const toast = sonnerToast;

// For backward compatibility
export const useToast = () => {
  return { toast: sonnerToast };
};
