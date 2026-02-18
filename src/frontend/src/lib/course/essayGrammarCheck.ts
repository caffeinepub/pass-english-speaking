import { detectAndCorrect } from '@/lib/friendTutor/detectAndCorrect';

export interface EssayGrammarResult {
  hasErrors: boolean;
  errorCount: number;
  corrections: string[];
}

export function checkEssayGrammar(lines: string[]): EssayGrammarResult {
  let errorCount = 0;
  const corrections: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      return; // Skip empty lines
    }

    const correctedText = detectAndCorrect(trimmedLine);
    if (correctedText !== null) {
      errorCount++;
      corrections.push(`Line ${index + 1}: "${trimmedLine}" → "${correctedText}"`);
    }
  });

  return {
    hasErrors: errorCount > 0,
    errorCount,
    corrections,
  };
}
