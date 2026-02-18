import { useState, useEffect } from 'react';
import { useLocalSettings } from './useLocalSettings';
import { validateOpenAIKeyFormat, validateGeminiKeyFormat } from '@/lib/settings/validateKeys';

/**
 * Hook that decides per-feature AI mode vs offline mode
 * Based on key presence and format validation
 */
export function useAiMode() {
  const { settings } = useLocalSettings();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [hasAttemptedAI, setHasAttemptedAI] = useState(false);

  // Reset connection error when keys change
  useEffect(() => {
    setConnectionError(null);
    setHasAttemptedAI(false);
  }, [settings.openaiKey, settings.geminiKey]);

  // Determine if we should attempt AI mode for Chat/Interview features
  const shouldUseAIMode = (): boolean => {
    // If already failed, stay in offline mode for this session
    if (connectionError) return false;

    // Check if any relevant key exists and is valid
    const hasOpenAI = settings.openaiKey.trim() !== '';
    const hasGemini = settings.geminiKey.trim() !== '';

    if (!hasOpenAI && !hasGemini) {
      return false; // No keys, use offline
    }

    // Validate format of available keys
    if (hasOpenAI) {
      const validation = validateOpenAIKeyFormat(settings.openaiKey);
      if (!validation.isValid && validation.errorMessage) {
        setConnectionError('Connection Error');
        return false;
      }
      if (validation.isValid) return true;
    }

    if (hasGemini) {
      const validation = validateGeminiKeyFormat(settings.geminiKey);
      if (!validation.isValid && validation.errorMessage) {
        setConnectionError('Connection Error');
        return false;
      }
      if (validation.isValid) return true;
    }

    return false;
  };

  const triggerConnectionError = () => {
    setConnectionError('Connection Error');
    setHasAttemptedAI(true);
  };

  const clearConnectionError = () => {
    setConnectionError(null);
    setHasAttemptedAI(false);
  };

  return {
    shouldUseAIMode: shouldUseAIMode(),
    connectionError,
    hasAttemptedAI,
    triggerConnectionError,
    clearConnectionError,
  };
}
