import { useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from '@/lib/powerMode/powerModeStorage';
import { validateOpenAIKey } from '@/lib/powerMode/validateOpenAIKey';

/**
 * Hook for managing Power Mode state
 * Power Mode is active when a valid-looking OpenAI API key is stored locally
 * CRITICAL: This hook only manages browser storage, never transmits keys
 */
export function usePowerMode() {
  const [apiKey, setApiKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load stored key on mount
  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoading(false);
  }, []);

  // Derived state: Power Mode is active if key exists and is valid
  const isPowerModeActive = apiKey.trim() !== '' && apiKey.startsWith('sk-');

  const updateApiKey = (newKey: string) => {
    const trimmedKey = newKey.trim();
    
    // Clear error when field is cleared
    if (trimmedKey === '') {
      setApiKey('');
      setErrorMessage('');
      clearStoredApiKey();
      return;
    }

    // Validate key format
    const validation = validateOpenAIKey(trimmedKey);
    
    if (validation.isValid) {
      setApiKey(trimmedKey);
      setErrorMessage('');
      setStoredApiKey(trimmedKey);
    } else {
      setApiKey(trimmedKey);
      setErrorMessage(validation.errorMessage || '');
      // Don't store invalid keys
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setErrorMessage('');
    clearStoredApiKey();
  };

  return {
    apiKey,
    isPowerModeActive,
    errorMessage,
    isLoading,
    updateApiKey,
    clearApiKey,
  };
}
