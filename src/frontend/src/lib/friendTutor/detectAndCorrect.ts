interface GrammarRule {
  pattern: RegExp;
  correction: (match: string) => string;
}

const grammarRules: GrammarRule[] = [
  // Subject-verb agreement: "I goes" -> "I go"
  {
    pattern: /\b(I|you|we|they)\s+(goes|does|has)\b/gi,
    correction: (match) => {
      const parts = match.split(/\s+/);
      const subject = parts[0];
      const verb = parts[1].toLowerCase();
      if (verb === 'goes') return `${subject} go`;
      if (verb === 'does') return `${subject} do`;
      if (verb === 'has') return `${subject} have`;
      return match;
    },
  },
  // Subject-verb agreement: "He go" -> "He goes"
  {
    pattern: /\b(he|she|it)\s+(go|do|have)\b/gi,
    correction: (match) => {
      const parts = match.split(/\s+/);
      const subject = parts[0];
      const verb = parts[1].toLowerCase();
      if (verb === 'go') return `${subject} goes`;
      if (verb === 'do') return `${subject} does`;
      if (verb === 'have') return `${subject} has`;
      return match;
    },
  },
  // "I am go" -> "I am going" or "I go"
  {
    pattern: /\b(am|is|are)\s+(go|come|eat|drink|play|work|study)\b/gi,
    correction: (match) => {
      const parts = match.split(/\s+/);
      return `${parts[0]} ${parts[1]}ing`;
    },
  },
  // Double negatives: "don't have no" -> "don't have any"
  {
    pattern: /\b(don't|doesn't|didn't|won't|can't)\s+\w+\s+(no|nothing|nobody)\b/gi,
    correction: (match) => {
      return match.replace(/\b(no|nothing|nobody)\b/gi, (neg) => {
        if (neg.toLowerCase() === 'no') return 'any';
        if (neg.toLowerCase() === 'nothing') return 'anything';
        if (neg.toLowerCase() === 'nobody') return 'anybody';
        return neg;
      });
    },
  },
  // "I have go" -> "I have to go" or "I have gone"
  {
    pattern: /\bhave\s+(go|come|eat|see|do)\b/gi,
    correction: (match) => {
      const parts = match.split(/\s+/);
      const verb = parts[1];
      // Convert to past participle
      const pastParticiples: Record<string, string> = {
        go: 'gone',
        come: 'come',
        eat: 'eaten',
        see: 'seen',
        do: 'done',
      };
      return `have ${pastParticiples[verb.toLowerCase()] || verb + 'ed'}`;
    },
  },
  // "I don't know nothing" -> "I don't know anything"
  {
    pattern: /\b(don't|doesn't|didn't)\s+(know|see|have|want)\s+(no|nothing|nobody)\b/gi,
    correction: (match) => {
      return match.replace(/\b(no|nothing|nobody)\b/gi, (neg) => {
        if (neg.toLowerCase() === 'no') return 'any';
        if (neg.toLowerCase() === 'nothing') return 'anything';
        if (neg.toLowerCase() === 'nobody') return 'anybody';
        return neg;
      });
    },
  },
];

export function detectAndCorrect(text: string): string | null {
  let correctedText = text;
  let hasMistake = false;

  for (const rule of grammarRules) {
    if (rule.pattern.test(correctedText)) {
      hasMistake = true;
      correctedText = correctedText.replace(rule.pattern, (match) => {
        return rule.correction(match);
      });
    }
  }

  // Return the corrected sentence if a mistake was found
  return hasMistake ? correctedText : null;
}
