/**
 * On-device sentence explanation using rule-based grammar analysis
 * No external API calls - all processing happens locally
 */

export function explainSentenceLocally(sentence: string): string {
  const trimmed = sentence.trim();
  
  if (!trimmed) {
    return "Please provide a sentence or word to explain.";
  }

  // Check if it's a single word
  if (!trimmed.includes(' ')) {
    return explainWord(trimmed);
  }

  // Analyze sentence structure
  const explanation: string[] = [];
  
  // Basic sentence structure analysis
  const words = trimmed.split(/\s+/);
  const firstWord = words[0].toLowerCase();
  
  // Identify sentence type
  if (trimmed.endsWith('?')) {
    explanation.push("This is a question sentence.");
    if (['is', 'am', 'are', 'do', 'does', 'did', 'can', 'will', 'would'].includes(firstWord)) {
      explanation.push(`It starts with "${firstWord}" which is a helping verb used to form questions.`);
    }
  } else if (trimmed.endsWith('!')) {
    explanation.push("This is an exclamatory sentence expressing strong emotion.");
  } else {
    explanation.push("This is a statement sentence.");
  }

  // Check for common grammar patterns
  if (trimmed.toLowerCase().includes(' is ') || trimmed.toLowerCase().includes(' am ') || trimmed.toLowerCase().includes(' are ')) {
    explanation.push("\nThe sentence uses a 'be' verb (is/am/are) to describe a state or condition.");
  }

  if (trimmed.toLowerCase().includes(' a ') || trimmed.toLowerCase().includes(' an ') || trimmed.toLowerCase().includes(' the ')) {
    explanation.push("\nIt contains articles (a/an/the) which help specify nouns.");
  }

  // Provide general guidance
  explanation.push("\n\n💡 Tip: Break down the sentence into subject (who/what) + verb (action/state) + object/complement (what/whom) to understand its structure better.");

  return explanation.join(' ');
}

function explainWord(word: string): string {
  const lower = word.toLowerCase();
  
  // Common Day 1 vocabulary
  const vocabulary: Record<string, string> = {
    'achieve': 'Achieve means to successfully reach a goal or complete something through effort. Example: "I want to achieve my dream of becoming a teacher."',
    'confident': 'Confident means feeling sure about your abilities. Example: "She is confident in her English speaking skills."',
    'opportunity': 'Opportunity means a chance to do something good or beneficial. Example: "This job is a great opportunity for me."',
    'improve': 'Improve means to make something better. Example: "I want to improve my grammar."',
    'practice': 'Practice means to do something repeatedly to get better at it. Example: "Practice makes perfect."',
    'knowledge': 'Knowledge means information and understanding about a subject. Example: "Reading books increases your knowledge."',
    'challenge': 'Challenge means a difficult task that tests your abilities. Example: "Learning English is a challenge, but I can do it."',
    'success': 'Success means achieving what you wanted or planned. Example: "Hard work leads to success."',
    'effort': 'Effort means the energy and work you put into doing something. Example: "With effort, you can learn anything."',
    'goal': 'Goal means something you want to achieve in the future. Example: "My goal is to speak English fluently."',
  };

  if (vocabulary[lower]) {
    return vocabulary[lower];
  }

  // Grammar words
  if (['is', 'am', 'are'].includes(lower)) {
    return `"${word}" is a form of the verb "be". Use "am" with "I", "is" with he/she/it, and "are" with you/we/they. Example: "I am happy", "She is smart", "They are students".`;
  }

  if (['a', 'an'].includes(lower)) {
    return `"${word}" is an indefinite article. Use "a" before consonant sounds and "an" before vowel sounds. Example: "a book", "an apple".`;
  }

  if (lower === 'the') {
    return '"The" is a definite article used to refer to specific things. Example: "the book on the table" (a specific book).';
  }

  // Generic explanation
  return `"${word}" - To understand this word better, try using it in a sentence and look at how it relates to other words. Pay attention to whether it's a noun (person/place/thing), verb (action), or adjective (describing word).`;
}
