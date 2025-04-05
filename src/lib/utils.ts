
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    // If URL parsing fails, just return the string
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}
