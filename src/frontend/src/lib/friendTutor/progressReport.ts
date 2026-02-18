import { MessageAnalysis } from './analyzeUserMessage';

export interface SessionFacts {
  totalMessages: number;
  grammarCorrections: string[];
  powerUpsSuggested: Array<{ original: string; suggestions: string[] }>;
  toneLabels: string[];
  vocabularySuggestions: string[];
}

export function createEmptySessionFacts(): SessionFacts {
  return {
    totalMessages: 0,
    grammarCorrections: [],
    powerUpsSuggested: [],
    toneLabels: [],
    vocabularySuggestions: [],
  };
}

export function updateSessionFacts(
  facts: SessionFacts,
  analysis: MessageAnalysis
): SessionFacts {
  const updated = { ...facts };
  updated.totalMessages += 1;

  // Track grammar corrections
  if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
    updated.grammarCorrections.push(analysis.grammar.correction);
  }

  // Track power-up suggestions
  if (analysis.powerAnswers.length > 0) {
    updated.powerUpsSuggested.push(...analysis.powerAnswers);
  }

  // Track tone
  if (analysis.tone.label !== 'Neutral') {
    updated.toneLabels.push(analysis.tone.label);
  }

  // Track vocabulary suggestions
  if (analysis.vocabulary.suggestions.length > 0) {
    updated.vocabularySuggestions.push(...analysis.vocabulary.suggestions);
  }

  return updated;
}

export function generateProgressReport(facts: SessionFacts): string {
  const lines: string[] = [];

  lines.push('📊 Progress Report');
  lines.push('');

  // Messages count
  lines.push(`✅ You've sent ${facts.totalMessages} messages in this session!`);

  // Grammar improvements
  if (facts.grammarCorrections.length > 0) {
    const uniqueCorrections = [...new Set(facts.grammarCorrections)].slice(0, 2);
    lines.push('');
    lines.push('📝 Grammar improvements:');
    uniqueCorrections.forEach((correction) => {
      lines.push(`  • ${correction}`);
    });
  }

  // Power-up vocabulary
  if (facts.powerUpsSuggested.length > 0) {
    const uniquePowerUps = facts.powerUpsSuggested.slice(0, 2);
    lines.push('');
    lines.push('💪 Power-up vocabulary learned:');
    uniquePowerUps.forEach((powerUp) => {
      lines.push(`  • ${powerUp.original} → ${powerUp.suggestions[0]}`);
    });
  }

  // Vocabulary suggestions
  if (facts.vocabularySuggestions.length > 0) {
    const uniqueSuggestions = [...new Set(facts.vocabularySuggestions)].slice(0, 2);
    lines.push('');
    lines.push('📚 Vocabulary tips:');
    uniqueSuggestions.forEach((suggestion) => {
      lines.push(`  • ${suggestion}`);
    });
  }

  // Tone variety
  if (facts.toneLabels.length > 0) {
    const uniqueTones = [...new Set(facts.toneLabels)];
    lines.push('');
    lines.push(`🎭 You expressed ${uniqueTones.length} different tone${uniqueTones.length > 1 ? 's' : ''}: ${uniqueTones.join(', ')}`);
  }

  lines.push('');
  lines.push('Keep up the great work! 🌟');

  return lines.join('\n');
}
