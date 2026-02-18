import type { AnswerRecord, AggregatedMetrics, SessionReport } from './documentTypes';

export function generateSessionReport(
  answerRecords: AnswerRecord[],
  aggregated: AggregatedMetrics
): SessionReport {
  // Calculate final score (out of 10)
  // Based on: logic (30%), clarity (30%), grammar (20%), filler reduction (20%)
  const logicScore = (aggregated.avgLogic / 3) * 3; // 0-3
  const clarityScore = (aggregated.avgClarity / 3) * 3; // 0-3
  
  // Grammar score based on corrections needed
  const correctionsNeeded = answerRecords.filter(r => 
    r.feedback.correction.includes('Corrected:')
  ).length;
  const grammarScore = Math.max(0, 2 - (correctionsNeeded / answerRecords.length) * 2); // 0-2
  
  // Filler score
  const avgFillersPerAnswer = aggregated.totalFillers / answerRecords.length;
  const fillerScore = Math.max(0, 2 - avgFillersPerAnswer * 0.5); // 0-2
  
  const finalScore = Math.round(logicScore + clarityScore + grammarScore + fillerScore);

  // Body Language (voice tone proxy)
  let bodyLanguage = '';
  if (avgFillersPerAnswer > 3) {
    bodyLanguage = 'Based on your speech patterns, you may be experiencing nervousness. We detected frequent filler words, which can indicate hesitation. Practice deep breathing before answering and take brief pauses instead of using fillers. This is a best-effort assessment based on transcript analysis.';
  } else if (aggregated.avgSentenceLength < 6) {
    bodyLanguage = 'Your responses suggest a cautious speaking style with shorter sentences. While clarity is good, consider expanding your thoughts to demonstrate confidence. Practice speaking in longer, flowing sentences. This assessment is based on transcript structure.';
  } else {
    bodyLanguage = 'Your speech patterns suggest a confident delivery. Sentence structure is well-balanced, and filler usage is minimal. Continue maintaining this steady pace and clear articulation. Note: This is a best-effort assessment based on transcript analysis, not actual voice tone.';
  }

  // Logical Consistency
  let logicalConsistency = '';
  if (aggregated.avgLogic >= 2.5) {
    logicalConsistency = 'Your answers demonstrate strong logical structure. You consistently provide well-organized responses with clear reasoning. Continue this approach in future interviews.';
  } else if (aggregated.avgLogic >= 2) {
    logicalConsistency = 'Your logical structure is developing well but could be strengthened. Some answers lacked clear progression of ideas. Practice the STAR method (Situation, Task, Action, Result) to improve structure.';
  } else {
    logicalConsistency = 'Your answers would benefit from better logical organization. Focus on structuring your thoughts before speaking: state your main point, provide supporting evidence, and conclude clearly. Practice outlining answers mentally before responding.';
  }

  // Areas of Improvement (UPSC Standard)
  const improvements: string[] = [];
  
  // Observation 1: Grammar patterns
  if (correctionsNeeded > answerRecords.length * 0.3) {
    const commonErrors = answerRecords
      .filter(r => r.feedback.correction.includes('Corrected:'))
      .slice(0, 2)
      .map(r => r.feedback.correction);
    improvements.push(`Grammar: ${correctionsNeeded} answers required corrections. Common patterns: ${commonErrors.join('; ')}. Review basic grammar rules and practice speaking in complete sentences.`);
  }

  // Observation 2: Filler words
  if (aggregated.totalFillers > answerRecords.length * 2) {
    improvements.push(`Filler Words: You used ${aggregated.totalFillers} filler words across ${answerRecords.length} answers (avg ${avgFillersPerAnswer.toFixed(1)} per answer). This indicates hesitation. Practice: Record yourself, identify fillers, and consciously pause instead.`);
  }

  // Observation 3: Answer depth
  const shortAnswers = answerRecords.filter(r => r.answer.split(/\s+/).length < 30).length;
  if (shortAnswers > answerRecords.length * 0.4) {
    improvements.push(`Answer Depth: ${shortAnswers} of ${answerRecords.length} answers were too brief. UPSC interviews expect detailed, thoughtful responses. Practice expanding answers with examples, context, and implications.`);
  }

  // Observation 4: Clarity
  if (aggregated.avgClarity < 2.5) {
    improvements.push(`Clarity: Your sentence structure needs improvement. Average sentence length: ${aggregated.avgSentenceLength.toFixed(1)} words. Aim for 10-15 words per sentence for optimal clarity. Practice speaking in clear, concise statements.`);
  }

  // Add generic improvement if less than 2 specific ones
  if (improvements.length < 2) {
    improvements.push('Overall Performance: Continue practicing mock interviews regularly. Focus on current affairs, ethical reasoning, and articulating your thoughts clearly under pressure. Record and review your practice sessions.');
  }

  const areasOfImprovement = improvements.join('\n\n');

  return {
    finalScore,
    bodyLanguage,
    logicalConsistency,
    areasOfImprovement,
  };
}
