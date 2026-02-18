/**
 * Local-only storage for OpenAI API key
 * CRITICAL: This key is stored ONLY in browser localStorage
 * and is NEVER transmitted to backend or any external server
 */

const STORAGE_KEY = 'openai_api_key';

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to read API key from storage:', error);
    return null;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch (error) {
    console.error('Failed to save API key to storage:', error);
  }
}

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear API key from storage:', error);
  }
}
