import { detectAndCorrect } from './detectAndCorrect';
import { MessageAnalysis } from './analyzeUserMessage';

export type PersonalityMode = 'friend' | 'teacher' | 'ai';

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

export function generateTutorReply(
  userMessage: string, 
  analysis?: MessageAnalysis,
  personality: PersonalityMode = 'friend'
): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Safety check
  const safetyCheck = checkContentSafety(userMessage);
  if (!safetyCheck.isSafe) {
    return 'I appreciate you wanting to practice English, but I\'m here to help with language learning in a positive way. How about we talk about your hobbies, daily activities, or practice describing things around you? What interests you?';
  }
  
  let reply = '';

  // Handle greetings
  if (greetings.some((greeting) => lowerMessage.includes(greeting))) {
    if (personality === 'friend') {
      reply = 'Hey there! 😊 So great to chat with you! What\'s on your mind today?';
    } else if (personality === 'teacher') {
      reply = 'Good day. I am pleased to assist you with your English learning. What would you like to discuss today?';
    } else {
      reply = 'Hello! It\'s great to chat with you. What would you like to talk about today?';
    }
  }
  // Handle farewells
  else if (farewells.some((farewell) => lowerMessage.includes(farewell))) {
    if (personality === 'friend') {
      reply = 'Bye! 👋 It was awesome talking to you! Keep practicing, you\'re doing great! 🌟';
    } else if (personality === 'teacher') {
      reply = 'Goodbye. It was a pleasure working with you today. Please continue to practice your English skills diligently.';
    } else {
      reply = 'Goodbye! It was nice talking to you. Keep practicing your English!';
    }
  }
  // Handle "how are you" questions
  else if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
    if (personality === 'friend') {
      reply = 'I\'m doing awesome, thanks for asking! 😄 How about you? How\'s your day going?';
    } else if (personality === 'teacher') {
      reply = 'I am functioning well, thank you for inquiring. How are you progressing with your studies today?';
    } else {
      reply = 'I\'m doing great, thank you for asking! How about you? How is your day going?';
    }
  }
  // Handle questions about the tutor
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    if (personality === 'friend') {
      reply = 'I\'m your buddy here to help you practice English! 🤖 Think of me as your friendly conversation partner!';
    } else if (personality === 'teacher') {
      reply = 'I am your English language instructor. My purpose is to guide you through proper English usage and correct any errors you may make.';
    } else {
      reply = 'I\'m your Chat Assistant! I\'m here to help you practice English in a fun and friendly way.';
    }
  }
  // Handle "thank you"
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    if (personality === 'friend') {
      reply = 'You\'re so welcome! 😊 Happy to help anytime! Got any other questions?';
    } else if (personality === 'teacher') {
      reply = 'You are welcome. It is my duty to assist you. Do you have any further questions?';
    } else {
      reply = 'You\'re welcome! I\'m happy to help you. Do you have any questions?';
    }
  }
  // Handle questions (contains ?)
  else if (userMessage.includes('?')) {
    if (personality === 'friend') {
      reply = 'Ooh, interesting question! 🤔 Tell me more about what you\'re thinking!';
    } else if (personality === 'teacher') {
      reply = 'That is a valid question. Please elaborate on your inquiry so I may provide proper guidance.';
    } else {
      reply = 'That\'s an interesting question! Can you tell me more about what you\'re thinking?';
    }
  }
  // Handle short responses
  else if (userMessage.split(' ').length <= 3) {
    if (personality === 'friend') {
      reply = 'Cool! 😎 Can you tell me more about that?';
    } else if (personality === 'teacher') {
      reply = 'I see. Please provide more details so we can have a more comprehensive discussion.';
    } else {
      reply = 'I see! Can you tell me more about that?';
    }
  }
  // Handle longer messages
  else if (userMessage.split(' ').length > 10) {
    if (personality === 'friend') {
      reply = 'Wow, thanks for sharing all that! 🌟 That\'s really interesting! What else is on your mind?';
    } else if (personality === 'teacher') {
      reply = 'Thank you for that detailed response. I appreciate your effort in expressing yourself. What else would you like to discuss?';
    } else {
      reply = 'Thank you for sharing that with me! That\'s very interesting. What else would you like to talk about?';
    }
  }
  // Default friendly response
  else {
    if (personality === 'friend') {
      const responses = [
        'That sounds cool! 😊 Tell me more!',
        'I hear you! What do you think about it? 🤔',
        'Nice! How do you feel about that? 💭',
        'Interesting! 🌟 Can you explain a bit more?',
        'I see what you mean! What happened next? 👀',
      ];
      reply = responses[Math.floor(Math.random() * responses.length)];
    } else if (personality === 'teacher') {
      const responses = [
        'That is noteworthy. Please elaborate further.',
        'I understand. What is your perspective on this matter?',
        'That is acceptable. How do you assess this situation?',
        'Interesting observation. Can you provide additional details?',
        'I comprehend your point. What occurred subsequently?',
      ];
      reply = responses[Math.floor(Math.random() * responses.length)];
    } else {
      const responses = [
        'That sounds interesting! Tell me more.',
        'I understand. What do you think about it?',
        'That\'s nice! How do you feel about that?',
        'Interesting! Can you explain a bit more?',
        'I see what you mean. What happened next?',
      ];
      reply = responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Add gentle corrections and tips if provided (only for Friend and AI modes)
  if (analysis && personality !== 'teacher') {
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
