import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getStorageUrl, BUCKETS } from "@/lib/supabase/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves media URL for both development and production environments
 * Now uses Supabase Storage instead of Strapi
 *
 * @param url - The media URL or path
 * @returns The full URL ready to use in img src
 */
export function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // If URL is already absolute (starts with http:// or https://), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // For relative paths, use Supabase Storage to get the public URL
  return getStorageUrl(url, BUCKETS.GENERAL);
}
