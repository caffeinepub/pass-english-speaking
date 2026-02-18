import type { ExtractionResult, InterviewQuestion } from './documentTypes';

const PANELISTS = ['Panelist 1', 'Panelist 2', 'Panelist 3', 'Panelist 4', 'Panelist 5'];

export function generateQuestions(
  extraction: ExtractionResult,
  manualNotes: string,
  mode: 'standard' | 'daf'
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const { summary } = extraction;
  const combinedText = extraction.text + ' ' + manualNotes;
  
  // Validate that we have sufficient content
  if (!combinedText.trim() || combinedText.trim().length < 20) {
    return [];
  }
  
  let panelistIndex = 0;
  const getNextPanelist = () => {
    const panelist = PANELISTS[panelistIndex % PANELISTS.length];
    panelistIndex++;
    return panelist;
  };

  // UPSC-style mandatory questions for DAF mode
  if (mode === 'daf') {
    // Civil services motivation
    questions.push({
      text: 'Why do you want to join the Civil Services? What motivates you to serve the nation?',
      category: 'Motivation',
      panelist: getNextPanelist(),
    });

    // Ethical dilemma
    questions.push({
      text: 'Imagine you are a district magistrate and discover that a close family member is involved in corruption. What would you do?',
      category: 'Ethics',
      panelist: getNextPanelist(),
    });

    // Current affairs contextualized
    const domain = summary.skills[0] || summary.education[0] || 'your field';
    questions.push({
      text: `What are the current challenges facing ${domain} in India, and how would you address them as a civil servant?`,
      category: 'Current Affairs',
      panelist: getNextPanelist(),
      derivedFrom: [domain],
    });
  }

  // Document-derived personal questions
  if (summary.education.length > 0) {
    questions.push({
      text: `Tell us about your educational background in ${summary.education[0]}. What inspired you to pursue this field?`,
      category: 'Personal',
      panelist: getNextPanelist(),
      derivedFrom: summary.education.slice(0, 1),
    });
  }

  if (summary.roles.length > 0) {
    questions.push({
      text: `You mentioned working as a ${summary.roles[0]}. What were your key responsibilities and achievements in this role?`,
      category: 'Experience',
      panelist: getNextPanelist(),
      derivedFrom: summary.roles.slice(0, 1),
    });
  }

  // Skills-based questions
  if (summary.skills.length > 0) {
    const skill = summary.skills[0];
    questions.push({
      text: `How would you rate your proficiency in ${skill}, and can you describe a challenging project where you applied this skill?`,
      category: 'Technical',
      panelist: getNextPanelist(),
      derivedFrom: [skill],
    });
  }

  // Achievement-based questions
  if (summary.achievements.length > 0) {
    questions.push({
      text: `You mentioned ${summary.achievements[0]}. Can you elaborate on the challenges you faced and how you overcame them?`,
      category: 'Achievement',
      panelist: getNextPanelist(),
      derivedFrom: summary.achievements.slice(0, 1),
    });
  }

  // Keyword-derived questions
  if (summary.keywords.length > 2) {
    const keyword = summary.keywords[1];
    questions.push({
      text: `I see ${keyword} mentioned in your profile. How has this shaped your professional journey?`,
      category: 'Background',
      panelist: getNextPanelist(),
      derivedFrom: [keyword],
    });
  }

  // Ensure we have at least some questions
  if (questions.length === 0) {
    // If no structured data, create generic content-based questions
    questions.push({
      text: 'Based on the information you provided, tell us about your background and what brings you here today.',
      category: 'Introduction',
      panelist: getNextPanelist(),
    });
    
    questions.push({
      text: 'What do you consider your greatest strength, and how have you demonstrated it in your experiences?',
      category: 'Personal',
      panelist: getNextPanelist(),
    });
  }

  return questions;
}
