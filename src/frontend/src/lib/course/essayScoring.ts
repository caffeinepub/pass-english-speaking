/**
 * On-device essay scoring utility that produces a score from 0 to 20.
 * Uses deterministic heuristics based on length, structure, and basic quality checks.
 */

export interface EssayScore {
  score: number; // 0-20
  feedback: string;
}

export function scoreEssay(essayText: string): EssayScore {
  const text = essayText.trim();

  // Empty essay
  if (text.length === 0) {
    return {
      score: 0,
      feedback: 'No essay submitted.',
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length scoring (0-5 points)
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount >= 100) {
    score += 5;
    feedback.push('Good length');
  } else if (wordCount >= 50) {
    score += 3;
    feedback.push('Adequate length');
  } else if (wordCount >= 20) {
    score += 2;
    feedback.push('Short essay');
  } else {
    score += 1;
    feedback.push('Very short essay');
  }

  // Sentence structure (0-5 points)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 5) {
    score += 5;
    feedback.push('Good sentence variety');
  } else if (sentences.length >= 3) {
    score += 3;
    feedback.push('Adequate sentences');
  } else {
    score += 1;
    feedback.push('Few sentences');
  }

  // Capitalization check (0-3 points)
  const hasCapitalStart = /^[A-Z]/.test(text);
  const capitalCount = (text.match(/[A-Z]/g) || []).length;
  if (hasCapitalStart && capitalCount >= 3) {
    score += 3;
    feedback.push('Good capitalization');
  } else if (hasCapitalStart) {
    score += 2;
    feedback.push('Basic capitalization');
  } else {
    score += 1;
    feedback.push('Check capitalization');
  }

  // Punctuation check (0-3 points)
  const punctuationCount = (text.match(/[.,!?;:]/g) || []).length;
  if (punctuationCount >= 5) {
    score += 3;
    feedback.push('Good punctuation');
  } else if (punctuationCount >= 2) {
    score += 2;
    feedback.push('Basic punctuation');
  } else {
    score += 1;
    feedback.push('Add more punctuation');
  }

  // Vocabulary diversity (0-4 points)
  const uniqueWords = new Set(
    text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  if (uniqueWords.size >= 30) {
    score += 4;
    feedback.push('Rich vocabulary');
  } else if (uniqueWords.size >= 15) {
    score += 3;
    feedback.push('Good vocabulary');
  } else if (uniqueWords.size >= 8) {
    score += 2;
    feedback.push('Basic vocabulary');
  } else {
    score += 1;
    feedback.push('Limited vocabulary');
  }

  // Cap at 20
  score = Math.min(score, 20);

  return {
    score,
    feedback: feedback.join(', '),
  };
}
