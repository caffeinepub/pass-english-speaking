export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  createdAt: Date;
  title?: string; // Optional title for special messages like Progress Report
  grammarCorrection?: string; // Optional grammar correction for user messages
}
