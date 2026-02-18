// Shared TypeScript types for course lesson topics and Story Mode subsection fields

export interface StoryModeSubsections {
  shortStory: string;
  realLifeExample: string;
  howToUseThisWord: string;
}

export interface LessonTopic {
  title: string;
  storyMode: StoryModeSubsections;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  storyMode?: StoryModeSubsections;
}
