export interface UploadedDocument {
  file: File;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
}

export interface ExtractionSummary {
  keywords: string[];
  skills: string[];
  education: string[];
  roles: string[];
  achievements: string[];
}

export interface ExtractionResult {
  text: string;
  summary: ExtractionSummary;
  pageCount?: number;
  extractionSuccess: boolean;
}

export interface InterviewQuestion {
  text: string;
  category: string;
  panelist: string;
  derivedFrom?: string[];
}

export interface CoachingFeedback {
  correction: string;
  pronunciation: string;
  proTip: string;
}

export interface AnswerMetrics {
  logic: string;
  clarity: string;
  fillerCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
}

export interface AnswerRecord {
  question: InterviewQuestion;
  answer: string;
  feedback: CoachingFeedback;
  metrics: AnswerMetrics;
}

export interface AggregatedMetrics {
  avgLogic: number;
  avgClarity: number;
  totalFillers: number;
  avgSentenceLength: number;
}

export interface SessionReport {
  finalScore: number;
  bodyLanguage: string;
  logicalConsistency: string;
  areasOfImprovement: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
