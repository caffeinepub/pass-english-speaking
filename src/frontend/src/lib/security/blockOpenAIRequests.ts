/**
 * Security utility to block any requests to OpenAI/ChatGPT domains.
 * This prevents accidental or intentional attempts to integrate with external LLM services
 * that are not supported on the Internet Computer platform.
 */

const BLOCKED_DOMAINS = [
  'api.openai.com',
  'openai.com',
  'chat.openai.com',
  'platform.openai.com',
];

/**
 * Checks if a URL targets a blocked domain
 */
function isBlockedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return BLOCKED_DOMAINS.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Installs runtime guards to block OpenAI/ChatGPT requests
 */
export function installOpenAIRequestBlocker(): void {
  // Wrap native fetch
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    if (isBlockedDomain(url)) {
      console.warn('[Security] Blocked request to OpenAI/ChatGPT domain:', url);
      return Promise.reject(new Error('OpenAI/ChatGPT integration is not available on this platform'));
    }
    
    // Check for Authorization Bearer headers targeting OpenAI
    if (init?.headers) {
      const headers = new Headers(init.headers);
      const authHeader = headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ') && isBlockedDomain(url)) {
        console.warn('[Security] Blocked OpenAI API key usage');
        return Promise.reject(new Error('OpenAI API key usage is not permitted'));
      }
    }
    
    return originalFetch.call(this, input, init);
  };

  // Wrap XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ): void {
    const urlString = typeof url === 'string' ? url : url.href;
    
    if (isBlockedDomain(urlString)) {
      console.warn('[Security] Blocked XHR request to OpenAI/ChatGPT domain:', urlString);
      throw new Error('OpenAI/ChatGPT integration is not available on this platform');
    }
    
    return originalOpen.call(this, method, url, async ?? true, username, password);
  };

  console.log('[Security] OpenAI/ChatGPT request blocker installed');
}
