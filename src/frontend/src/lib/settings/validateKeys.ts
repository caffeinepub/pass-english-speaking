/**
 * Lightweight format validation for API keys
 * These are format-only checks, no network calls
 */

export interface KeyValidation {
  isValid: boolean;
  errorMessage?: string;
}

export function validateOpenAIKeyFormat(key: string): KeyValidation {
  const trimmed = key.trim();
  
  if (trimmed === '') {
    return { isValid: false, errorMessage: '' };
  }
  
  if (!trimmed.startsWith('sk-')) {
    return {
      isValid: false,
      errorMessage: 'OpenAI API keys must start with "sk-"',
    };
  }
  
  if (trimmed.length < 20) {
    return {
      isValid: false,
      errorMessage: 'API key appears too short',
    };
  }
  
  return { isValid: true };
}

export function validateGeminiKeyFormat(key: string): KeyValidation {
  const trimmed = key.trim();
  
  if (trimmed === '') {
    return { isValid: false, errorMessage: '' };
  }
  
  // Gemini keys are typically alphanumeric strings
  if (trimmed.length < 20) {
    return {
      isValid: false,
      errorMessage: 'API key appears too short',
    };
  }
  
  // Basic alphanumeric check
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'API key contains invalid characters',
    };
  }
  
  return { isValid: true };
}
