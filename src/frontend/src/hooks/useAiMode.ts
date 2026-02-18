import { useState, useEffect } from 'react';
import { useLocalSettings } from './useLocalSettings';

/**
 * Hook that decides per-feature AI mode vs offline mode
 * Based on key presence, format validation, and enabled toggles
 */
export function useAiMode() {
  const { settings, openaiStatus, geminiStatus } = useLocalSettings();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [hasAttemptedAI, setHasAttemptedAI] = useState(false);

  // Reset connection error when keys or toggles change
  useEffect(() => {
    setConnectionError(null);
    setHasAttemptedAI(false);
  }, [settings.openaiKey, settings.geminiKey, settings.openaiEnabled, settings.geminiEnabled]);

  // Determine if we should attempt AI mode for Chat/Interview features
  const shouldUseAIMode = (): boolean => {
    // If already failed, stay in offline mode for this session
    if (connectionError) return false;

    // Check if any provider is enabled and connected
    const hasValidOpenAI = settings.openaiEnabled && openaiStatus.status === 'connected';
    const hasValidGemini = settings.geminiEnabled && geminiStatus.status === 'connected';

    return hasValidOpenAI || hasValidGemini;
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
