import type { AnswerMetrics, AggregatedMetrics } from './documentTypes';

export function computeMetrics(transcript: string): AnswerMetrics {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const avgSentenceLength = sentenceCount > 0 ? words.length / sentenceCount : 0;

  // Filler word count
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];
  const lowerTranscript = transcript.toLowerCase();
  const fillerCount = fillerWords.reduce((count, filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  // Logic assessment
  let logic = 'Good';
  if (sentenceCount < 2) {
    logic = 'Needs Improvement - Answer too brief';
  } else if (avgSentenceLength < 5) {
    logic = 'Fair - Use more complete sentences';
  } else if (avgSentenceLength > 25) {
    logic = 'Fair - Sentences too long, break them down';
  } else if (fillerCount > 3) {
    logic = 'Fair - Reduce filler words for better structure';
  }

  // Clarity assessment
  let clarity = 'Good';
  if (fillerCount > 4) {
    clarity = 'Needs Improvement - Too many fillers';
  } else if (transcript.length < 30) {
    clarity = 'Fair - Answer too short';
  } else if (sentenceCount > 0 && avgSentenceLength > 20) {
    clarity = 'Fair - Simplify sentence structure';
  }

  return {
    logic,
    clarity,
    fillerCount,
    sentenceCount,
    avgSentenceLength,
  };
}

export function aggregateMetrics(metrics: AnswerMetrics[]): AggregatedMetrics {
  if (metrics.length === 0) {
    return {
      avgLogic: 0,
      avgClarity: 0,
      totalFillers: 0,
      avgSentenceLength: 0,
    };
  }

  const logicScores = metrics.map(m => {
    if (m.logic.includes('Good')) return 3;
    if (m.logic.includes('Fair')) return 2;
    return 1;
  });

  const clarityScores = metrics.map(m => {
    if (m.clarity.includes('Good')) return 3;
    if (m.clarity.includes('Fair')) return 2;
    return 1;
  });

  const avgLogic = logicScores.reduce((a, b) => a + b, 0) / logicScores.length;
  const avgClarity = clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length;
  const totalFillers = metrics.reduce((sum, m) => sum + m.fillerCount, 0);
  const avgSentenceLength = metrics.reduce((sum, m) => sum + m.avgSentenceLength, 0) / metrics.length;

  return {
    avgLogic,
    avgClarity,
    totalFillers,
    avgSentenceLength,
  };
}
