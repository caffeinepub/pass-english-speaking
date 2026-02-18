/**
 * Local-only storage for app settings
 * CRITICAL: All settings are stored ONLY in browser localStorage
 * and are NEVER transmitted to backend or any external server
 */

const STORAGE_KEYS = {
  OPENAI_KEY: 'settings_openai_key',
  GEMINI_KEY: 'settings_gemini_key',
  EXTERNAL_LINKS: 'settings_external_links',
  WEBSITE_API_KEYS: 'settings_website_api_keys',
};

export interface LocalSettings {
  openaiKey: string;
  geminiKey: string;
  externalLinks: string;
  websiteApiKeys: string;
}

export function getLocalSettings(): LocalSettings {
  try {
    return {
      openaiKey: localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || '',
      geminiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '',
      externalLinks: localStorage.getItem(STORAGE_KEYS.EXTERNAL_LINKS) || '',
      websiteApiKeys: localStorage.getItem(STORAGE_KEYS.WEBSITE_API_KEYS) || '',
    };
  } catch (error) {
    console.error('Failed to read settings from storage:', error);
    return {
      openaiKey: '',
      geminiKey: '',
      externalLinks: '',
      websiteApiKeys: '',
    };
  }
}

export function setOpenAIKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, key);
  } catch (error) {
    console.error('Failed to save OpenAI key:', error);
  }
}

export function setGeminiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key);
  } catch (error) {
    console.error('Failed to save Gemini key:', error);
  }
}

export function setExternalLinks(links: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXTERNAL_LINKS, links);
  } catch (error) {
    console.error('Failed to save external links:', error);
  }
}

export function setWebsiteApiKeys(keys: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEBSITE_API_KEYS, keys);
  } catch (error) {
    console.error('Failed to save website API keys:', error);
  }
}

export function clearAllSettings(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}
