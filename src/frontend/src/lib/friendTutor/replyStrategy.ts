/**
 * Context-grounding helpers for generating specific, helpful replies
 * Extracts topics, detects question types, and suggests appropriate next-step actions
 */

export interface MessageContext {
  isQuestion: boolean;
  isShortMessage: boolean;
  isLongMessage: boolean;
  extractedTopic: string | null;
  questionType: 'what' | 'why' | 'how' | 'when' | 'where' | 'who' | 'general' | null;
}

export function analyzeMessageContext(message: string): MessageContext {
  const wordCount = message.trim().split(/\s+/).length;
  const lowerMessage = message.toLowerCase();
  
  // Detect if it's a question
  const isQuestion = message.includes('?');
  
  // Classify question type
  let questionType: MessageContext['questionType'] = null;
  if (isQuestion) {
    if (lowerMessage.includes('what')) questionType = 'what';
    else if (lowerMessage.includes('why')) questionType = 'why';
    else if (lowerMessage.includes('how')) questionType = 'how';
    else if (lowerMessage.includes('when')) questionType = 'when';
    else if (lowerMessage.includes('where')) questionType = 'where';
    else if (lowerMessage.includes('who')) questionType = 'who';
    else questionType = 'general';
  }
  
  // Extract a simple topic (key nouns/verbs)
  const extractedTopic = extractSimpleTopic(message);
  
  return {
    isQuestion,
    isShortMessage: wordCount <= 3,
    isLongMessage: wordCount > 10,
    extractedTopic,
    questionType,
  };
}

function extractSimpleTopic(message: string): string | null {
  // Remove common words and extract meaningful content
  const commonWords = new Set([
    'i', 'me', 'my', 'you', 'your', 'the', 'a', 'an', 'is', 'am', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'can', 'could', 'should', 'may', 'might', 'must', 'this', 'that', 'these', 'those',
    'it', 'its', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'with', 'from', 'about',
  ]);
  
  const words = message.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  if (words.length === 0) return null;
  
  // Return first meaningful word or phrase
  return words[0];
}

export function generateContextAwarePrompt(
  context: MessageContext,
  mode: 'friend' | 'teacher' | 'ai'
): string {
  const { isQuestion, isShortMessage, extractedTopic, questionType } = context;
  
  // For questions, provide targeted responses
  if (isQuestion && questionType) {
    return generateQuestionResponse(questionType, extractedTopic, mode);
  }
  
  // For short messages, provide topic-grounded expansion prompts
  if (isShortMessage) {
    return generateShortMessagePrompt(extractedTopic, mode);
  }
  
  // Default: topic-grounded follow-up
  return generateTopicFollowUp(extractedTopic, mode);
}

function generateQuestionResponse(
  questionType: NonNullable<MessageContext['questionType']>,
  topic: string | null,
  mode: 'friend' | 'teacher' | 'ai'
): string {
  const topicPhrase = topic ? ` about ${topic}` : '';
  
  if (mode === 'friend') {
    const responses = {
      what: `Great question${topicPhrase}! 🤔 Let me think... Can you give me a bit more context so I can help you better?`,
      why: `Ooh, that's a deep one${topicPhrase}! 💭 What made you curious about this?`,
      how: `Interesting${topicPhrase}! 🔍 Are you asking about the process or the method?`,
      when: `Good timing question${topicPhrase}! ⏰ Are you asking about past, present, or future?`,
      where: `Location question${topicPhrase}! 📍 Can you be more specific about what you're looking for?`,
      who: `People question${topicPhrase}! 👥 Tell me more about who you're asking about!`,
      general: `That's a good question${topicPhrase}! 🤔 Can you elaborate a bit more?`,
    };
    return responses[questionType];
  } else if (mode === 'teacher') {
    const responses = {
      what: `That is a valid "what" question${topicPhrase}. To provide proper guidance, please specify what aspect you are inquiring about.`,
      why: `You are asking "why"${topicPhrase}. Please provide more context so I can explain the reasoning clearly.`,
      how: `This is a "how" question${topicPhrase}. Are you asking about the method, process, or manner? Please clarify.`,
      when: `You are inquiring about timing${topicPhrase}. Please specify the time frame you are interested in.`,
      where: `This is a location-based question${topicPhrase}. Please provide more details about the place or context.`,
      who: `You are asking about a person or people${topicPhrase}. Please give me more information to assist you properly.`,
      general: `That is a thoughtful question${topicPhrase}. Please elaborate so I can provide a comprehensive answer.`,
    };
    return responses[questionType];
  } else {
    const responses = {
      what: `That's an interesting "what" question${topicPhrase}! Can you provide more details so I can give you a helpful answer?`,
      why: `Good "why" question${topicPhrase}! What specifically are you curious about?`,
      how: `Nice "how" question${topicPhrase}! Are you asking about the process or the way to do something?`,
      when: `Timing question${topicPhrase}! Can you give me more context about the time frame?`,
      where: `Location question${topicPhrase}! What specific place or context are you asking about?`,
      who: `People-focused question${topicPhrase}! Tell me more about who you're asking about.`,
      general: `That's a good question${topicPhrase}! Can you elaborate so I can help you better?`,
    };
    return responses[questionType];
  }
}

function generateShortMessagePrompt(topic: string | null, mode: 'friend' | 'teacher' | 'ai'): string {
  const topicPhrase = topic ? ` about ${topic}` : '';
  
  if (mode === 'friend') {
    const prompts = [
      `Got it${topicPhrase}! 😊 Can you tell me one more thing about it?`,
      `Nice${topicPhrase}! 👍 What do you think about it?`,
      `I see${topicPhrase}! 💭 How does that make you feel?`,
      `Okay${topicPhrase}! ✨ Can you describe it in a sentence?`,
      `Cool${topicPhrase}! 🌟 What happened with that?`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  } else if (mode === 'teacher') {
    return `I understand${topicPhrase}. Please expand your thought into a complete sentence. For example, describe why you mentioned this or provide more context.`;
  } else {
    return `I see${topicPhrase}. Can you expand on that? Try adding more details or explaining your thoughts in a complete sentence.`;
  }
}

function generateTopicFollowUp(topic: string | null, mode: 'friend' | 'teacher' | 'ai'): string {
  const topicPhrase = topic ? ` regarding ${topic}` : '';
  
  if (mode === 'friend') {
    const prompts = [
      `That's interesting${topicPhrase}! 😊 Tell me more - what's your take on it?`,
      `I hear you${topicPhrase}! 💭 How do you feel about that?`,
      `Nice${topicPhrase}! 🌟 Can you give me an example?`,
      `Got it${topicPhrase}! 👍 What made you think of that?`,
      `Cool${topicPhrase}! ✨ What else can you tell me?`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  } else if (mode === 'teacher') {
    const prompts = [
      `That is noteworthy${topicPhrase}. Please provide a specific example to illustrate your point.`,
      `I understand${topicPhrase}. Can you explain your reasoning in more detail?`,
      `Acceptable${topicPhrase}. What is your assessment of this situation?`,
      `Interesting observation${topicPhrase}. Please elaborate with additional context.`,
      `I comprehend${topicPhrase}. What conclusion can you draw from this?`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  } else {
    const prompts = [
      `That's interesting${topicPhrase}! Can you tell me more about your thoughts on this?`,
      `I understand${topicPhrase}. What's your perspective on it?`,
      `That's good${topicPhrase}! Can you give me an example or more details?`,
      `I see${topicPhrase}. What made you think about this?`,
      `Interesting${topicPhrase}! What else would you like to share?`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}
