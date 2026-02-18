import { MessageAnalysis } from './analyzeUserMessage';
import { getIdentityResponse } from './persona';
import { detectLanguage, getHindiResponse } from './languageDetection';
import { analyzeMessageContext, generateContextAwarePrompt } from './replyStrategy';

/**
 * Power Mode tutor reply generator
 * Provides more detailed, structured responses compared to Normal Mode
 * NOTE: Still runs on-device, no external API calls
 */

const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
const farewells = ['bye', 'goodbye', 'see you', 'take care', 'later'];

function checkContentSafety(message: string): { isSafe: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  
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

export function generatePowerTutorReply(userMessage: string, analysis?: MessageAnalysis): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Safety check
  const safetyCheck = checkContentSafety(userMessage);
  if (!safetyCheck.isSafe) {
    return '⚡ Power Mode: I appreciate your interest in practicing, but let\'s focus on positive topics that help you learn English effectively. How about discussing your goals, hobbies, or daily experiences? What would you like to talk about?';
  }
  
  // Check for Hindi/Hinglish
  const langDetection = detectLanguage(userMessage);
  if (langDetection.isHindiOrHinglish) {
    const hindiResponse = getHindiResponse(lowerMessage);
    if (hindiResponse) {
      return `⚡ ${hindiResponse}`;
    }
    
    // Generic Hindi/Hinglish response for Power Mode
    return '⚡ Main samajh gaya! (I understand!) In Power Mode, I can help you translate and improve your English. Try expressing that thought in English, and I\'ll provide detailed feedback. What would you like to say?';
  }
  
  let reply = '';

  // Handle greetings with more detail
  if (greetings.some((greeting) => lowerMessage.includes(greeting))) {
    reply = '⚡ Hello! I\'m excited to help you practice English today. In Power Mode, I can provide more detailed feedback and suggestions. What topic would you like to explore?';
  }
  // Handle farewells with encouragement
  else if (farewells.some((farewell) => lowerMessage.includes(farewell))) {
    reply = '⚡ Goodbye! You\'re making great progress. Remember to practice daily for the best results. See you next time!';
  }
  // Handle "how are you" questions
  else if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
    reply = '⚡ I\'m doing wonderfully, thank you! I\'m here to help you improve your English skills. How has your learning journey been going? Any challenges you\'d like to discuss?';
  }
  // Handle questions about the tutor - use persona identity
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    reply = `⚡ ${getIdentityResponse('ai')} In Power Mode, I provide enhanced feedback with detailed explanations and structured learning guidance.`;
  }
  // Handle "thank you"
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    reply = '⚡ You\'re very welcome! I\'m here to support your learning journey. Feel free to ask questions or practice any aspect of English you\'d like to improve.';
  }
  // Use context-aware strategy for other messages
  else {
    const context = analyzeMessageContext(userMessage);
    const baseReply = generateContextAwarePrompt(context, 'ai');
    reply = `⚡ ${baseReply}`;
  }

  // Add enhanced corrections and tips in Power Mode
  if (analysis) {
    const sections: string[] = [];

    // Grammar correction with explanation
    if (analysis.grammar.hasMistakes && analysis.grammar.correction) {
      sections.push(
        `\n\n📝 Grammar Tip: "${analysis.grammar.correction}"\n` +
        `This correction improves clarity and follows standard English grammar rules.`
      );
    }

    // Power answers with multiple suggestions
    if (analysis.powerAnswers.length > 0) {
      const powerUp = analysis.powerAnswers[0];
      sections.push(
        `\n\n💪 Vocabulary Enhancement:\n` +
        `Instead of: "${powerUp.original}"\n` +
        `Try these: ${powerUp.suggestions.slice(0, 2).map(s => `"${s}"`).join(' or ')}\n` +
        `These alternatives sound more natural and expressive.`
      );
    }

    // Tone feedback - use tone.label for indexing
    if (analysis.tone && analysis.tone.label) {
      const toneEmojiMap: Record<string, string> = {
        'Positive': '😊',
        'Very Positive': '😄',
        'Negative': '😔',
        'Strong Negative': '😢',
        'Curious': '🤔',
        'Energetic': '⚡',
        'Neutral': '😐',
      };
      
      const toneEmoji = toneEmojiMap[analysis.tone.label] || '💬';
      
      sections.push(
        `\n\n${toneEmoji} Tone: Your message sounds ${analysis.tone.description}. ` +
        `This helps convey your emotions effectively in English.`
      );
    }

    reply += sections.join('');
  }

  return reply;
}
