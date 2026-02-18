/**
 * Language detection utilities for Hindi/Hinglish support
 * Detects when users write in Hindi or Hinglish and triggers mixed-language responses
 */

// Devanagari Unicode range: U+0900 to U+097F
const DEVANAGARI_PATTERN = /[\u0900-\u097F]/;

// Common Hinglish/Hindi romanized patterns
const HINGLISH_PATTERNS = [
  /\b(tum|tumhe|tumhara|tumhari|mujhe|mera|meri|mere)\b/i,
  /\b(kaun|kya|kaise|kahan|kyun|kab)\b/i,
  /\b(hai|ho|hoon|hain|tha|thi|the)\b/i,
  /\b(acha|accha|theek|thik|sahi|galat)\b/i,
  /\b(chahiye|chahte|chahta|chahti)\b/i,
  /\b(help|samajh|samjha|bata|batao|sikha|sikhao)\b/i,
  /\b(nahi|nahin|haan|ha|ji)\b/i,
];

export interface LanguageDetectionResult {
  isHindiOrHinglish: boolean;
  hasDevanagari: boolean;
  hasHinglishPatterns: boolean;
}

export function detectLanguage(text: string): LanguageDetectionResult {
  const hasDevanagari = DEVANAGARI_PATTERN.test(text);
  const hasHinglishPatterns = HINGLISH_PATTERNS.some(pattern => pattern.test(text));
  
  return {
    isHindiOrHinglish: hasDevanagari || hasHinglishPatterns,
    hasDevanagari,
    hasHinglishPatterns,
  };
}

// Specific common Hindi/Hinglish questions with mixed responses
export const HINDI_RESPONSES: Record<string, string> = {
  'tum kaun ho': 'Main tumhara English Learning Companion hoon! 😊 (I am your English Learning Companion!) In English, you can ask "Who are you?" or "Who are you, exactly?" Let\'s practice English together!',
  'tum kya ho': 'Main ek English sikhane wala AI hoon! 🤖 (I am an English teaching AI!) You can say "What are you?" in English. I help you learn and practice English!',
  'mujhe help chahiye': 'Haan, main tumhari help karunga! 👍 (Yes, I will help you!) In English, say "I need help" or "Can you help me?" What do you need help with?',
  'kya tum meri help kar sakte ho': 'Bilkul! Main zaroor help karunga! ✨ (Absolutely! I will definitely help!) In English: "Can you help me?" Let me know what you need!',
  'acha': 'Acha! 😊 (Okay!) In English, you can say "Okay", "Alright", or "I see". What would you like to talk about?',
  'theek hai': 'Theek hai! 👍 (Alright!) In English: "Okay" or "That\'s fine". Shall we continue practicing?',
};

export function getHindiResponse(lowerMessage: string): string | null {
  // Check for exact matches first
  for (const [pattern, response] of Object.entries(HINDI_RESPONSES)) {
    if (lowerMessage.includes(pattern)) {
      return response;
    }
  }
  return null;
}
