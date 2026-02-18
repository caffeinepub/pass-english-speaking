import { detectAndCorrect } from '../friendTutor/detectAndCorrect';
import type { CoachingFeedback, InterviewQuestion } from './documentTypes';

export function coachAnswer(transcript: string, question: InterviewQuestion): CoachingFeedback {
  // Grammar correction
  const corrected = detectAndCorrect(transcript);
  const correction = corrected 
    ? `Corrected: "${corrected}"`
    : 'No grammar errors detected. Well done!';

  // Pronunciation analysis (best-effort from transcript signals)
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
  const lowerTranscript = transcript.toLowerCase();
  const fillerCount = fillerWords.filter(filler => lowerTranscript.includes(filler)).length;
  
  let pronunciation = '';
  if (fillerCount > 2) {
    pronunciation = `We detected ${fillerCount} filler words (um, uh, like, etc.). Try to pause briefly instead of using fillers. Practice speaking more deliberately.`;
  } else if (transcript.length < 20) {
    pronunciation = 'Your answer was quite brief. In interviews, aim for more detailed responses. Practice expanding your thoughts with examples.';
  } else {
    pronunciation = 'Your speech flow appears good. Continue practicing clear enunciation and maintaining a steady pace. Record yourself to identify any pronunciation patterns.';
  }

  // Pro tip (more formal phrasing)
  let proTip = '';
  if (question.category === 'Motivation' || question.category === 'Personal') {
    proTip = 'For personal questions, structure your answer using the STAR method: Situation, Task, Action, Result. This provides clarity and demonstrates organized thinking.';
  } else if (question.category === 'Ethics') {
    proTip = 'For ethical dilemmas, acknowledge the complexity, state your values clearly, and explain your reasoning step-by-step. Show that you can balance competing interests.';
  } else if (question.category === 'Technical' || question.category === 'Experience') {
    proTip = 'When discussing technical topics or experience, use specific examples and quantify your impact where possible. Avoid vague statements.';
  } else {
    proTip = 'Strengthen your answer by adding concrete examples from your experience. Use professional language and maintain eye contact (voice confidence) throughout.';
  }

  return {
    correction,
    pronunciation,
    proTip,
  };
}
