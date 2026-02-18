import { validateOpenAIKeyFormat, validateGeminiKeyFormat } from './validateKeys';

export type ProviderStatus = 'disabled' | 'connected' | 'error';

export interface ProviderStatusInfo {
  status: ProviderStatus;
  reason: string;
}

export function getOpenAIStatus(enabled: boolean, key: string): ProviderStatusInfo {
  if (!enabled) {
    return { status: 'disabled', reason: 'Provider is disabled' };
  }

  const trimmed = key.trim();
  if (trimmed === '') {
    return { status: 'error', reason: 'API key is missing' };
  }

  const validation = validateOpenAIKeyFormat(key);
  if (!validation.isValid) {
    return { status: 'error', reason: validation.errorMessage || 'Invalid API key format' };
  }

  return { status: 'connected', reason: 'Connected' };
}

export function getGeminiStatus(enabled: boolean, key: string): ProviderStatusInfo {
  if (!enabled) {
    return { status: 'disabled', reason: 'Provider is disabled' };
  }

  const trimmed = key.trim();
  if (trimmed === '') {
    return { status: 'error', reason: 'API key is missing' };
  }

  const validation = validateGeminiKeyFormat(key);
  if (!validation.isValid) {
    return { status: 'error', reason: validation.errorMessage || 'Invalid API key format' };
  }

  return { status: 'connected', reason: 'Connected' };
}
