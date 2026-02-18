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
      text: `What would you consider your most significant professional achievement, and what did you learn from it?`,
      category: 'Achievements',
      panelist: getNextPanelist(),
      derivedFrom: summary.achievements.slice(0, 2),
    });
  }

  // Keyword-derived questions
  if (summary.keywords.length >= 3) {
    const keywords = summary.keywords.slice(0, 3).join(', ');
    questions.push({
      text: `I notice your background includes ${keywords}. How do these areas complement each other in your career?`,
      category: 'Integration',
      panelist: getNextPanelist(),
      derivedFrom: summary.keywords.slice(0, 3),
    });
  }

  // Generic professional questions if not enough document-derived
  const genericQuestions = [
    {
      text: 'What are your greatest strengths, and how have they contributed to your professional success?',
      category: 'Self-Assessment',
    },
    {
      text: 'Describe a situation where you faced a significant challenge. How did you overcome it?',
      category: 'Problem Solving',
    },
    {
      text: 'Where do you see yourself in five years, and how does this position align with your goals?',
      category: 'Career Goals',
    },
    {
      text: 'How do you handle criticism and feedback from supervisors or colleagues?',
      category: 'Interpersonal',
    },
    {
      text: 'Can you give an example of a time when you demonstrated leadership?',
      category: 'Leadership',
    },
  ];

  // Add generic questions to reach minimum count
  const minQuestions = mode === 'daf' ? 10 : 8;
  let genericIndex = 0;
  while (questions.length < minQuestions && genericIndex < genericQuestions.length) {
    questions.push({
      ...genericQuestions[genericIndex],
      panelist: getNextPanelist(),
    });
    genericIndex++;
  }

  return questions;
}
