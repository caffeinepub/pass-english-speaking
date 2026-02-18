export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

export function validateHttpUrl(url: string): UrlValidationResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL',
    };
  }

  try {
    // Try to parse the URL
    let urlObj: URL;
    
    // If URL doesn't start with http:// or https://, prepend https://
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      urlObj = new URL(`https://${trimmed}`);
    } else {
      urlObj = new URL(trimmed);
    }

    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Only http:// and https:// URLs are allowed',
      };
    }

    return {
      isValid: true,
      normalizedUrl: urlObj.href,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Please enter a valid URL (e.g., https://example.com)',
    };
  }
}
