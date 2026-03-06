export type TranslationStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export type TranslationModel = 'claude-sonnet' | 'claude-opus' | 'gpt-4o' | 'byok';

export type TranslationStyle = 'general' | 'legal' | 'technical' | 'medical' | 'informal';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface UploadedFile {
  fileId: string;
  fileName: string;
  pageCount: number;
  detectedLanguage: string;
  wordCount: number;
  size: number;
}

export interface TranslationJob {
  jobId: string;
  fileId?: string;
  fileName?: string;
  inputText?: string;
  sourceLanguage: string;
  targetLanguage: string;
  model: TranslationModel;
  style: TranslationStyle;
  status: TranslationStatus;
  completedChunks: number;
  totalChunks: number;
  estimatedTime?: number;
  estimatedCost?: number;
  createdAt: Date;
  completedAt?: Date;
  pageCount?: number;
  wordCount?: number;
  processingTime?: number;
}

export interface TranslationChunk {
  index: number;
  originalText: string;
  translatedText: string;
}

export interface TranslationResult {
  jobId: string;
  chunks: TranslationChunk[];
  wordCount: number;
  processingTime: number;
  model: TranslationModel;
  cost: number;
}

export interface HistoryItem {
  jobId: string;
  fileName: string;
  date: Date;
  sourceLang: string;
  targetLang: string;
  model: TranslationModel;
  pages: number;
  status: TranslationStatus;
  cost: number;
}
