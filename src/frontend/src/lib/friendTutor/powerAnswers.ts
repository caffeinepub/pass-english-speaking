interface PowerAnswer {
  original: string;
  suggestions: string[];
}

interface PowerAnswerRule {
  pattern: RegExp;
  suggestions: string[];
}

const powerAnswerRules: PowerAnswerRule[] = [
  {
    pattern: /\b(I am|I'm)\s+happy\b/gi,
    suggestions: [
      'I am over the moon',
      'I am thrilled',
      'I am delighted',
    ],
  },
  {
    pattern: /\b(I am|I'm)\s+sad\b/gi,
    suggestions: [
      'I am feeling down',
      'I am a bit blue',
      'I am disappointed',
    ],
  },
  {
    pattern: /\b(I am|I'm)\s+tired\b/gi,
    suggestions: [
      'I am exhausted',
      'I am worn out',
      'I am feeling drained',
    ],
  },
  {
    pattern: /\b(it is|it's)\s+good\b/gi,
    suggestions: [
      'It is excellent',
      'It is wonderful',
      'It is fantastic',
    ],
  },
  {
    pattern: /\b(it is|it's)\s+bad\b/gi,
    suggestions: [
      'It is terrible',
      'It is disappointing',
      'It is unfortunate',
    ],
  },
  {
    pattern: /\b(very|really)\s+good\b/gi,
    suggestions: [
      'excellent',
      'outstanding',
      'remarkable',
    ],
  },
  {
    pattern: /\b(very|really)\s+bad\b/gi,
    suggestions: [
      'terrible',
      'awful',
      'dreadful',
    ],
  },
  {
    pattern: /\b(I like|I love)\s+it\b/gi,
    suggestions: [
      'I enjoy it',
      'I appreciate it',
      'I am fond of it',
    ],
  },
  {
    pattern: /\b(I don't like|I hate)\s+it\b/gi,
    suggestions: [
      'I am not fond of it',
      'I dislike it',
      'It is not my cup of tea',
    ],
  },
  {
    pattern: /\b(I want|I need)\s+to\b/gi,
    suggestions: [
      'I would like to',
      'I am eager to',
      'I am hoping to',
    ],
  },
];

export function detectPowerAnswers(text: string): PowerAnswer[] {
  const powerAnswers: PowerAnswer[] = [];
  
  for (const rule of powerAnswerRules) {
    const matches = text.match(rule.pattern);
    if (matches && matches.length > 0) {
      // Get the first match to avoid duplicates
      const original = matches[0];
      powerAnswers.push({
        original,
        suggestions: rule.suggestions,
      });
      // Only return the first power answer to keep it simple
      break;
    }
  }
  
  return powerAnswers;
}
