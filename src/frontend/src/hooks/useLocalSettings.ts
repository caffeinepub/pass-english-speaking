import { useState, useEffect } from 'react';
import {
  getLocalSettings,
  setOpenAIKey,
  setGeminiKey,
  setExternalLinks,
  setWebsiteApiKeys,
  setOpenAIEnabled,
  setGeminiEnabled,
  type LocalSettings,
} from '@/lib/settings/localSettingsStorage';
import { getOpenAIStatus, getGeminiStatus, type ProviderStatusInfo } from '@/lib/settings/providerStatus';

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
    openaiEnabled: false,
    geminiEnabled: false,
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

  const updateOpenAIEnabled = (enabled: boolean) => {
    setOpenAIEnabled(enabled);
    setSettings((prev) => ({ ...prev, openaiEnabled: enabled }));
  };

  const updateGeminiEnabled = (enabled: boolean) => {
    setGeminiEnabled(enabled);
    setSettings((prev) => ({ ...prev, geminiEnabled: enabled }));
  };

  // Compute provider status
  const openaiStatus: ProviderStatusInfo = getOpenAIStatus(settings.openaiEnabled, settings.openaiKey);
  const geminiStatus: ProviderStatusInfo = getGeminiStatus(settings.geminiEnabled, settings.geminiKey);

  return {
    settings,
    isLoading,
    updateOpenAIKey,
    updateGeminiKey,
    updateExternalLinks,
    updateWebsiteApiKeys,
    updateOpenAIEnabled,
    updateGeminiEnabled,
    openaiStatus,
    geminiStatus,
  };
}
