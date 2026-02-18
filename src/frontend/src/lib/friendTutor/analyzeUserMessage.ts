import { detectAndCorrect } from './detectAndCorrect';
import { detectPowerAnswers } from './powerAnswers';

export interface MessageAnalysis {
  grammar: {
    hasMistakes: boolean;
    correction: string | null;
  };
  tone: {
    label: string;
    description: string;
  };
  vocabulary: {
    basicWords: string[];
    suggestions: string[];
  };
  powerAnswers: Array<{
    original: string;
    suggestions: string[];
  }>;
  // Extended for context awareness
  messageLength: number;
  hasQuestion: boolean;
  extractedKeywords: string[];
}

export function analyzeUserMessage(text: string): MessageAnalysis {
  // Grammar analysis
  const correction = detectAndCorrect(text);
  
  // Tone analysis
  const tone = analyzeTone(text);
  
  // Vocabulary analysis
  const vocabulary = analyzeVocabulary(text);
  
  // Power answers
  const powerAnswers = detectPowerAnswers(text);
  
  // Context signals
  const messageLength = text.trim().split(/\s+/).length;
  const hasQuestion = text.includes('?');
  const extractedKeywords = extractKeywords(text);

  return {
    grammar: {
      hasMistakes: correction !== null,
      correction,
    },
    tone,
    vocabulary,
    powerAnswers,
    messageLength,
    hasQuestion,
    extractedKeywords,
  };
}

function analyzeTone(text: string): { label: string; description: string } {
  const lowerText = text.toLowerCase();
  
  // Positive indicators
  const positiveWords = ['happy', 'great', 'good', 'love', 'wonderful', 'amazing', 'excellent', 'fantastic', 'nice', 'beautiful'];
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  
  // Negative indicators
  const negativeWords = ['sad', 'bad', 'hate', 'terrible', 'awful', 'horrible', 'angry', 'upset', 'disappointed'];
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  // Strong indicators (exclamation marks, caps)
  const hasExclamation = text.includes('!');
  const hasMultipleExclamations = (text.match(/!/g) || []).length > 1;
  const hasCaps = /[A-Z]{3,}/.test(text);
  
  // Question indicators
  const hasQuestion = text.includes('?');
  
  if (positiveCount > negativeCount) {
    if (hasMultipleExclamations || hasCaps) {
      return { label: 'Very Positive', description: 'enthusiastic and excited' };
    }
    return { label: 'Positive', description: 'friendly and upbeat' };
  } else if (negativeCount > positiveCount) {
    if (hasMultipleExclamations || hasCaps) {
      return { label: 'Strong Negative', description: 'upset or frustrated' };
    }
    return { label: 'Negative', description: 'concerned or unhappy' };
  } else if (hasQuestion) {
    return { label: 'Curious', description: 'asking and learning' };
  } else if (hasExclamation) {
    return { label: 'Energetic', description: 'engaged and expressive' };
  }
  
  return { label: 'Neutral', description: 'calm and balanced' };
}

function analyzeVocabulary(text: string): { basicWords: string[]; suggestions: string[] } {
  const basicWords: string[] = [];
  const suggestions: string[] = [];
  
  const basicWordMap: Record<string, string> = {
    'good': 'excellent, wonderful, fantastic',
    'bad': 'terrible, awful, disappointing',
    'big': 'huge, enormous, massive',
    'small': 'tiny, little, compact',
    'nice': 'pleasant, delightful, lovely',
    'very': 'extremely, incredibly, remarkably',
    'like': 'enjoy, appreciate, prefer',
    'want': 'desire, wish for, would like',
    'get': 'obtain, receive, acquire',
    'make': 'create, produce, build',
  };
  
  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b\w+\b/g) || [];
  
  for (const word of words) {
    if (basicWordMap[word]) {
      if (!basicWords.includes(word)) {
        basicWords.push(word);
        suggestions.push(`"${word}" → ${basicWordMap[word]}`);
      }
    }
  }
  
  return { basicWords, suggestions };
}

function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'i', 'me', 'my', 'you', 'your', 'the', 'a', 'an', 'is', 'am', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'can', 'could', 'should', 'may', 'might', 'must', 'this', 'that', 'these', 'those',
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  return words.slice(0, 3); // Return top 3 keywords
}
