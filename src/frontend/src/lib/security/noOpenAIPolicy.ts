/**
 * Developer Policy: OpenAI/ChatGPT Integration
 * 
 * This module documents the policy regarding OpenAI/ChatGPT integration for this application.
 * 
 * POLICY:
 * - OpenAI/ChatGPT API integration is NOT supported on the Internet Computer platform
 * - API keys for external LLM services must NOT be stored in the codebase
 * - The backend canister cannot make HTTP calls to external LLM APIs
 * - All AI/tutor functionality must be implemented using on-device, client-side logic
 * 
 * RATIONALE:
 * - The Internet Computer's HTTP outcall system has limitations for third-party API integration
 * - Storing API keys in the frontend or backend poses security risks
 * - Client-side processing ensures privacy and reduces costs
 * 
 * ALTERNATIVES:
 * - Use rule-based natural language processing
 * - Implement pattern matching for common language learning scenarios
 * - Leverage browser APIs (Web Speech API for TTS/STT)
 * - Consider on-chain AI models when available
 * 
 * This policy is enforced at runtime via the blockOpenAIRequests module.
 */

export const OPENAI_POLICY = {
  allowed: false,
  reason: 'Platform limitations and security constraints',
  alternatives: [
    'Rule-based NLP',
    'Pattern matching',
    'Browser APIs',
    'On-device processing'
  ]
} as const;
