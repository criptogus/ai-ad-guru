
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  // Filter out non-HTTP protocols and javascript: links
  if (url.startsWith('mailto:') || 
      url.startsWith('tel:') || 
      url.startsWith('javascript:') || 
      url.startsWith('#')) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);
    return urlObj.hostname === baseUrlObj.hostname;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove trailing slashes and normalize to lowercase
    return urlObj.toString()
      .replace(/\/+$/, '')
      .toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
