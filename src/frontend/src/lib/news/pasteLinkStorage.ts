const STORAGE_KEY = 'news_pasted_link';

export function getPastedNewsUrl(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setPastedNewsUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearPastedNewsUrl(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
