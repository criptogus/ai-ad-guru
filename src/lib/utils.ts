
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return domain.replace(/^www\./, '');
  } catch (e) {
    // Return the input if it's not a valid URL
    return url.replace(/^www\./, '');
  }
}
