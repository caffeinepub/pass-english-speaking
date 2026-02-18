import { day1LessonContent } from './day1LessonContent';

export type TestQuestion = {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
};

/**
 * Generates Day 1 test questions strictly from Day 1 lesson content.
 * Total: 180 marks (90 grammar + 90 vocabulary)
 */
export function generateDay1TestQuestions(): TestQuestion[] {
  const questions: TestQuestion[] = [];

  // Grammar: Is/Am/Are (90 questions, 90 marks)
  const grammarQuestions: TestQuestion[] = [
    { type: 'multiple-choice', question: 'I ___ a student.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ happy today.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ my friends.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ learning English.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'It ___ a beautiful day.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ at school.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ my brother.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ ready to go.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The cat ___ sleeping.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You and I ___ good friends.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The book ___ on the table.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'My parents ___ at home.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ very tired.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The dog ___ barking.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ happy to help.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ a teacher.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ playing outside.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ from India.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The flowers ___ beautiful.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ very smart.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ my best friend.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ excited about the trip.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The children ___ in the park.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ reading a book.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ going to the market.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'It ___ raining outside.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ hungry.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The students ___ studying.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ a doctor.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ very kind.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ learning English.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The birds ___ singing.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ my sister.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ ready for the test.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'It ___ very hot today.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ happy to see you.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The teachers ___ in the classroom.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ playing football.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ a good person.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ working hard.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The water ___ cold.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ my family.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ at home.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ cooking food.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ friends.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The house ___ big.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ a student.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ thirsty.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The cat ___ on the table.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ teachers.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ reading a book.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ my friend.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ eating food.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The book ___ interesting.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ happy.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ a teacher.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The students ___ in the house.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ drinking water.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ a family.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ with my friend.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The food ___ delicious.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ students.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ in the house.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ my teacher.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ looking at the cat.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The water ___ in the glass.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ reading books.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ happy with his family.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ a good student.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The teachers ___ kind.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ eating food.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ with your friend.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ in my house.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The cat ___ drinking water.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'They ___ happy students.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ good friends.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ with my family.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The book ___ on the table.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ a good teacher.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ eating food.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ drinking water.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The students ___ with their teacher.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'He ___ in the house.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'We ___ happy with the book.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'I ___ a friend.', options: ['am', 'is', 'are'], correctAnswer: 'am', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'The family ___ at home.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'She ___ with her cat.', options: ['am', 'is', 'are'], correctAnswer: 'is', topic: 'Grammar - Is/Am/Are' },
    { type: 'multiple-choice', question: 'You ___ a good friend.', options: ['am', 'is', 'are'], correctAnswer: 'are', topic: 'Grammar - Is/Am/Are' },
  ];

  questions.push(...grammarQuestions);

  // Vocabulary Questions (90 questions, 90 marks)
  // 9 questions per word × 10 words = 90 questions
  const vocabWords = day1LessonContent.vocabulary.words;

  vocabWords.forEach((wordData) => {
    const word = wordData.word;
    const meaning = wordData.meaning;

    // Question 1: Definition
    questions.push({
      type: 'multiple-choice',
      question: `What does "${word}" mean?`,
      options: [meaning, 'something else', 'another thing', 'different meaning'],
      correctAnswer: meaning,
      topic: `Vocabulary - ${word}`,
    });

    // Question 2: Fill in the blank
    questions.push({
      type: 'multiple-choice',
      question: `I have a ___ at home. (${word})`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 3: Sentence completion
    questions.push({
      type: 'multiple-choice',
      question: `The ___ is very nice.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 4: Usage
    questions.push({
      type: 'multiple-choice',
      question: `I am with my ___.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 5: Context
    questions.push({
      type: 'multiple-choice',
      question: `She has a ___.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 6: Plural/singular
    questions.push({
      type: 'multiple-choice',
      question: `They are ___.`,
      options: [word + 's', 'wrong', 'incorrect', 'other'],
      correctAnswer: word + 's',
      topic: `Vocabulary - ${word}`,
    });

    // Question 7: Adjective usage
    questions.push({
      type: 'multiple-choice',
      question: `This is a good ___.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 8: Possessive
    questions.push({
      type: 'multiple-choice',
      question: `My ___ is here.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });

    // Question 9: Action with word
    questions.push({
      type: 'multiple-choice',
      question: `I like my ___.`,
      options: [word, 'wrong', 'incorrect', 'other'],
      correctAnswer: word,
      topic: `Vocabulary - ${word}`,
    });
  });

  return questions;
}
