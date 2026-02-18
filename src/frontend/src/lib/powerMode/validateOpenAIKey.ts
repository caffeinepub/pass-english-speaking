/**
 * Validates OpenAI API key format
 * Returns validation result and error message if invalid
 */

export interface KeyValidation {
  isValid: boolean;
  errorMessage?: string;
}

export function validateOpenAIKey(key: string): KeyValidation {
  // Empty key is valid (Normal Mode)
  if (!key || key.trim() === '') {
    return { isValid: true };
  }

  // Non-empty key must start with "sk-"
  if (!key.startsWith('sk-')) {
    return {
      isValid: false,
      errorMessage: 'Invalid Key! Please check your OpenAI account.',
    };
  }

  return { isValid: true };
}
