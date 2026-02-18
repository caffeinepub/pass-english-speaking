import { useState, useEffect } from 'react';
import {
  getLocalSettings,
  setOpenAIKey,
  setGeminiKey,
  setExternalLinks,
  setWebsiteApiKeys,
  type LocalSettings,
} from '@/lib/settings/localSettingsStorage';

/**
 * Hook for managing local settings stored in browser
 * All settings are browser-local only and never transmitted to servers
 */
export function useLocalSettings() {
  const [settings, setSettings] = useState<LocalSettings>({
    openaiKey: '',
    geminiKey: '',
    externalLinks: '',
    websiteApiKeys: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = getLocalSettings();
    setSettings(loadedSettings);
    setIsLoading(false);
  }, []);

  const updateOpenAIKey = (key: string) => {
    setOpenAIKey(key);
    setSettings((prev) => ({ ...prev, openaiKey: key }));
  };

  const updateGeminiKey = (key: string) => {
    setGeminiKey(key);
    setSettings((prev) => ({ ...prev, geminiKey: key }));
  };

  const updateExternalLinks = (links: string) => {
    setExternalLinks(links);
    setSettings((prev) => ({ ...prev, externalLinks: links }));
  };

  const updateWebsiteApiKeys = (keys: string) => {
    setWebsiteApiKeys(keys);
    setSettings((prev) => ({ ...prev, websiteApiKeys: keys }));
  };

  return {
    settings,
    isLoading,
    updateOpenAIKey,
    updateGeminiKey,
    updateExternalLinks,
    updateWebsiteApiKeys,
  };
}
