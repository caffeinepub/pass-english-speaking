import { detectAndCorrect } from './detectAndCorrect';
import { MessageAnalysis } from './analyzeUserMessage';
import { getIdentityResponse } from './persona';
import { detectLanguage, getHindiResponse } from './languageDetection';
import { analyzeMessageContext, generateContextAwarePrompt } from './replyStrategy';

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
  
  // Check for Hindi/Hinglish
  const langDetection = detectLanguage(userMessage);
  if (langDetection.isHindiOrHinglish) {
    const hindiResponse = getHindiResponse(lowerMessage);
    if (hindiResponse) {
      return hindiResponse;
    }
    
    // Generic Hindi/Hinglish response
    if (personality === 'friend') {
      return 'Main samajh gaya! 😊 (I understand!) Let\'s practice in English together. In English, you can say: "I understand" or "I got it". What would you like to talk about in English?';
    } else if (personality === 'teacher') {
      return 'Main samajh gaya. (I understand.) For proper English practice, please try expressing your thoughts in English. I will help you with corrections and improvements. What would you like to say in English?';
    } else {
      return 'Samajh gaya! (Understood!) Let\'s practice English together. Try saying that in English, and I\'ll help you improve it. What would you like to express?';
    }
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
  // Handle questions about the tutor - use persona identity
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    reply = getIdentityResponse(personality);
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
  // Use context-aware strategy for other messages
  else {
    const context = analyzeMessageContext(userMessage);
    reply = generateContextAwarePrompt(context, personality);
  }

  // Add mode-specific corrections and tips
  if (analysis) {
    const sections: string[] = [];

    if (personality === 'friend') {
      // Friend mode: gentle, playful corrections
      if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
        sections.push(`\n\n✏️ Quick tip: "${analysis.grammar.correction}" sounds more natural! 😊`);
      }

      if (analysis.powerAnswers.length > 0) {
        const powerUp = analysis.powerAnswers[0];
        const firstSuggestion = powerUp.suggestions[0];
        sections.push(
          `\n\n💪 Level up: Try "${firstSuggestion}" instead of "${powerUp.original}"!`
        );
      }
    } else if (personality === 'teacher') {
      // Teacher mode: structured correction + explanation + example
      if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
        sections.push(
          `\n\n📝 Correction: "${analysis.grammar.correction}"\n` +
          `Explanation: This follows proper English grammar rules and improves clarity.\n` +
          `Example: Use this structure in similar sentences.`
        );
      }

      if (analysis.powerAnswers.length > 0) {
        const powerUp = analysis.powerAnswers[0];
        sections.push(
          `\n\n📚 Vocabulary Enhancement:\n` +
          `Original: "${powerUp.original}"\n` +
          `Better alternatives: ${powerUp.suggestions.slice(0, 2).join(', ')}\n` +
          `Practice: Try using these in your next sentence.`
        );
      }
    } else {
      // AI mode: balanced feedback
      if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
        sections.push(`\n\n✏️ Tip: You could say "${analysis.grammar.correction}"`);
      }

      if (analysis.powerAnswers.length > 0) {
        const powerUp = analysis.powerAnswers[0];
        const firstSuggestion = powerUp.suggestions[0];
        sections.push(
          `\n\n💪 Try this: Instead of "${powerUp.original}", you could say "${firstSuggestion}"`
        );
      }
    }

    reply += sections.join('');
  }

  return reply;
}
