import type { ExtractionSummary } from './documentTypes';

export function summarizeExtraction(text: string): ExtractionSummary {
  const lowerText = text.toLowerCase();
  
  // Extract keywords (common important words)
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 50);
  
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    const lower = word.toLowerCase();
    wordFreq.set(lower, (wordFreq.get(lower) || 0) + 1);
  });
  
  const keywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  // Extract skills (common skill keywords)
  const skillPatterns = [
    'javascript', 'python', 'java', 'react', 'node', 'typescript', 'sql',
    'leadership', 'management', 'communication', 'teamwork', 'problem solving',
    'analysis', 'design', 'development', 'testing', 'agile', 'scrum'
  ];
  const skills = skillPatterns.filter(skill => lowerText.includes(skill));

  // Extract education (common education keywords)
  const educationPatterns = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'engineering', 'science', 'arts', 'commerce', 'mba', 'btech', 'mtech'
  ];
  const education = educationPatterns.filter(edu => lowerText.includes(edu));

  // Extract roles (common job titles)
  const rolePatterns = [
    'engineer', 'developer', 'manager', 'analyst', 'consultant', 'designer',
    'architect', 'lead', 'senior', 'junior', 'intern', 'director', 'officer'
  ];
  const roles = rolePatterns.filter(role => lowerText.includes(role));

  // Extract achievements (words near achievement indicators)
  const achievementIndicators = ['achieved', 'led', 'managed', 'developed', 'created', 'improved'];
  const achievements: string[] = [];
  achievementIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      achievements.push(indicator);
    }
  });

  return {
    keywords: [...new Set(keywords)],
    skills: [...new Set(skills)],
    education: [...new Set(education)],
    roles: [...new Set(roles)],
    achievements: [...new Set(achievements)],
  };
}
