import { detectAndCorrect } from '@/lib/friendTutor/detectAndCorrect';

export interface PowerEssayFeedback {
  hasErrors: boolean;
  errorCount: number;
  corrections: string[];
  suggestions: string[];
  overallScore: number;
}

/**
 * Power Mode essay feedback generator
 * Provides enhanced analysis with detailed suggestions
 * NOTE: Still runs on-device, no external API calls
 */
export function generatePowerEssayFeedback(lines: string[]): PowerEssayFeedback {
  let errorCount = 0;
  const corrections: string[] = [];
  const suggestions: string[] = [];

  // Check each line for grammar errors
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      return;
    }

    const correctedText = detectAndCorrect(trimmedLine);
    if (correctedText !== null) {
      errorCount++;
      corrections.push(
        `Line ${index + 1}: "${trimmedLine}" → "${correctedText}"\n` +
        `Explanation: This correction improves grammar and clarity.`
      );
    }
  });

  // Generate suggestions based on essay structure
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  
  if (nonEmptyLines.length < 5) {
    suggestions.push('⚡ Try to write exactly 5 complete lines for a well-structured essay.');
  }

  // Check for variety in sentence structure
  const shortSentences = nonEmptyLines.filter(l => l.split(' ').length < 5).length;
  if (shortSentences > 2) {
    suggestions.push('⚡ Consider using longer, more detailed sentences to express your ideas fully.');
  }

  // Check for descriptive language
  const hasDescriptiveWords = nonEmptyLines.some(l => 
    /\b(beautiful|interesting|wonderful|amazing|great|nice|good|happy|sad)\b/i.test(l)
  );
  if (!hasDescriptiveWords) {
    suggestions.push('⚡ Add descriptive adjectives to make your writing more vivid and engaging.');
  }

  // Check for connecting words
  const hasConnectors = nonEmptyLines.some(l => 
    /\b(and|but|because|so|also|however|therefore|moreover)\b/i.test(l)
  );
  if (!hasConnectors) {
    suggestions.push('⚡ Use connecting words (and, but, because) to link your ideas smoothly.');
  }

  // Calculate overall score (out of 10)
  let overallScore = 10;
  if (errorCount > 0) {
    overallScore = Math.max(5, 10 - errorCount * 2);
  }

  return {
    hasErrors: errorCount > 0,
    errorCount,
    corrections,
    suggestions,
    overallScore,
  };
}
