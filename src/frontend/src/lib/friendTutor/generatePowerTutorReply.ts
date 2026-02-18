import { MessageAnalysis } from './analyzeUserMessage';

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
  // Handle questions about the tutor
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    reply = '⚡ I\'m your enhanced Chat Assistant running in Power Mode! This means I can provide more comprehensive feedback, detailed explanations, and structured learning guidance to help you master English faster.';
  }
  // Handle "thank you"
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    reply = '⚡ You\'re very welcome! I\'m here to support your learning journey. Feel free to ask questions or practice any aspect of English you\'d like to improve.';
  }
  // Handle questions with detailed responses
  else if (userMessage.includes('?')) {
    reply = '⚡ That\'s a thoughtful question! Let me help you explore this topic. Can you provide more context or specific details about what you\'re curious about? This will help me give you a more comprehensive answer.';
  }
  // Handle short responses with encouragement
  else if (userMessage.split(' ').length <= 3) {
    reply = '⚡ I see! To help you practice more effectively, try expanding your thoughts into complete sentences. For example, you could describe why you feel that way or add more details about the situation.';
  }
  // Handle longer messages with structured feedback
  else if (userMessage.split(' ').length > 10) {
    reply = '⚡ Excellent! You\'re expressing yourself well with detailed sentences. This kind of practice is very valuable for building fluency. What other topics would you like to discuss or practice?';
  }
  // Default enhanced response
  else {
    const responses = [
      '⚡ That\'s interesting! Can you elaborate on that? Try using descriptive words to paint a clearer picture.',
      '⚡ I understand what you\'re saying. How does this relate to your daily life or experiences?',
      '⚡ Good expression! Now, can you rephrase that using different vocabulary to practice variety?',
      '⚡ Nice! To take it further, try adding more context or explaining the reasoning behind your thoughts.',
      '⚡ I see your point. What would you say if you were explaining this to someone who knows nothing about the topic?',
    ];
    reply = responses[Math.floor(Math.random() * responses.length)];
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
