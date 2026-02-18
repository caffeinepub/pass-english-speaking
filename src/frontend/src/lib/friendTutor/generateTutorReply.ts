import { detectAndCorrect } from './detectAndCorrect';
import { MessageAnalysis } from './analyzeUserMessage';

const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
const farewells = ['bye', 'goodbye', 'see you', 'take care', 'later'];

// Lightweight safety check for inappropriate content
function checkContentSafety(message: string): { isSafe: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  
  // Check for inappropriate topics
  const inappropriatePatterns = [
    /\b(violence|violent|kill|murder|weapon|gun|bomb)\b/i,
    /\b(drug|cocaine|heroin|marijuana)\b/i,
    /\b(hate|racist|sexist)\b/i,
  ];
  
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(lowerMessage)) {
      return { 
        isSafe: false, 
        reason: 'inappropriate topic' 
      };
    }
  }
  
  return { isSafe: true };
}

export function generateTutorReply(userMessage: string, analysis?: MessageAnalysis): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Safety check
  const safetyCheck = checkContentSafety(userMessage);
  if (!safetyCheck.isSafe) {
    return 'I appreciate you wanting to practice English, but I\'m here to help with language learning in a positive way. How about we talk about your hobbies, daily activities, or practice describing things around you? What interests you?';
  }
  
  let reply = '';

  // Handle greetings
  if (greetings.some((greeting) => lowerMessage.includes(greeting))) {
    reply = 'Hello! It\'s great to chat with you. What would you like to talk about today?';
  }
  // Handle farewells
  else if (farewells.some((farewell) => lowerMessage.includes(farewell))) {
    reply = 'Goodbye! It was nice talking to you. Keep practicing your English!';
  }
  // Handle "how are you" questions
  else if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
    reply = 'I\'m doing great, thank you for asking! How about you? How is your day going?';
  }
  // Handle questions about the tutor
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    reply = 'I\'m your Chat Assistant! I\'m here to help you practice English in a fun and friendly way.';
  }
  // Handle "thank you"
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    reply = 'You\'re welcome! I\'m happy to help you. Do you have any questions?';
  }
  // Handle questions (contains ?)
  else if (userMessage.includes('?')) {
    reply = 'That\'s an interesting question! Can you tell me more about what you\'re thinking?';
  }
  // Handle short responses
  else if (userMessage.split(' ').length <= 3) {
    reply = 'I see! Can you tell me more about that?';
  }
  // Handle longer messages
  else if (userMessage.split(' ').length > 10) {
    reply = 'Thank you for sharing that with me! That\'s very interesting. What else would you like to talk about?';
  }
  // Default friendly response
  else {
    const responses = [
      'That sounds interesting! Tell me more.',
      'I understand. What do you think about it?',
      'That\'s nice! How do you feel about that?',
      'Interesting! Can you explain a bit more?',
      'I see what you mean. What happened next?',
    ];
    reply = responses[Math.floor(Math.random() * responses.length)];
  }

  // Add gentle corrections and tips if provided
  if (analysis) {
    const sections: string[] = [];

    // Grammar correction - gentle and concise
    if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
      sections.push(`\n\n✏️ Tip: You could say "${analysis.grammar.correction}"`);
    }

    // Power answers - only show the first suggestion
    if (analysis.powerAnswers.length > 0) {
      const powerUp = analysis.powerAnswers[0];
      const firstSuggestion = powerUp.suggestions[0];
      sections.push(
        `\n\n💪 Try this: Instead of "${powerUp.original}", you could say "${firstSuggestion}"`
      );
    }

    reply += sections.join('');
  }

  return reply;
}
