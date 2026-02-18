const STORAGE_KEY_PREFIX = 'fallback_news_url_';

export function getFallbackUrl(regionId: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${regionId}`);
  } catch (error) {
    console.error('Failed to get fallback URL from storage:', error);
    return null;
  }
}

export function setFallbackUrl(regionId: string, url: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${regionId}`, url);
  } catch (error) {
    console.error('Failed to save fallback URL to storage:', error);
  }
}

export function clearFallbackUrl(regionId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${regionId}`);
  } catch (error) {
    console.error('Failed to clear fallback URL from storage:', error);
  }
}
