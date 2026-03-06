'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TranslationJob, UploadedFile, TranslationModel, TranslationStyle, HistoryItem } from './types';
import { MOCK_HISTORY } from './mock-data';

interface TranslateDocsStore {
  // Current session
  uploadedFiles: UploadedFile[];
  inputText: string;
  sourceLanguage: string;
  targetLanguage: string;
  selectedModel: TranslationModel;
  selectedStyle: TranslationStyle;
  activeJob: TranslationJob | null;

  // History
  history: HistoryItem[];

  // Settings
  anthropicKey: string;
  openaiKey: string;
  defaultTargetLanguage: string;
  defaultModel: TranslationModel;
  defaultStyle: TranslationStyle;

  // Actions
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  setInputText: (text: string) => void;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  setSelectedModel: (model: TranslationModel) => void;
  setSelectedStyle: (style: TranslationStyle) => void;
  setActiveJob: (job: TranslationJob | null) => void;
  updateActiveJob: (updates: Partial<TranslationJob>) => void;
  addToHistory: (item: HistoryItem) => void;
  setAnthropicKey: (key: string) => void;
  setOpenaiKey: (key: string) => void;
  setDefaultTargetLanguage: (lang: string) => void;
  setDefaultModel: (model: TranslationModel) => void;
  setDefaultStyle: (style: TranslationStyle) => void;
  reset: () => void;
}

export const useStore = create<TranslateDocsStore>()(
  persist(
    (set, get) => ({
      // Defaults
      uploadedFiles: [],
      inputText: '',
      sourceLanguage: 'auto',
      targetLanguage: 'en',
      selectedModel: 'claude-sonnet',
      selectedStyle: 'general',
      activeJob: null,
      history: MOCK_HISTORY,
      anthropicKey: '',
      openaiKey: '',
      defaultTargetLanguage: 'en',
      defaultModel: 'claude-sonnet',
      defaultStyle: 'general',

      addUploadedFile: (file) =>
        set((s) => ({ uploadedFiles: [...s.uploadedFiles, file] })),

      removeUploadedFile: (fileId) =>
        set((s) => ({ uploadedFiles: s.uploadedFiles.filter((f) => f.fileId !== fileId) })),

      setInputText: (text) => set({ inputText: text }),
      setSourceLanguage: (lang) => set({ sourceLanguage: lang }),
      setTargetLanguage: (lang) => set({ targetLanguage: lang }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      setActiveJob: (job) => set({ activeJob: job }),

      updateActiveJob: (updates) =>
        set((s) => ({
          activeJob: s.activeJob ? { ...s.activeJob, ...updates } : null,
        })),

      addToHistory: (item) =>
        set((s) => ({ history: [item, ...s.history] })),

      setAnthropicKey: (key) => set({ anthropicKey: key }),
      setOpenaiKey: (key) => set({ openaiKey: key }),
      setDefaultTargetLanguage: (lang) => set({ defaultTargetLanguage: lang }),
      setDefaultModel: (model) => set({ defaultModel: model }),
      setDefaultStyle: (style) => set({ defaultStyle: style }),

      reset: () =>
        set({
          uploadedFiles: [],
          inputText: '',
          activeJob: null,
        }),
    }),
    {
      name: 'translatedocs-store',
      partialize: (state) => ({
        history: state.history,
        anthropicKey: state.anthropicKey,
        openaiKey: state.openaiKey,
        defaultTargetLanguage: state.defaultTargetLanguage,
        defaultModel: state.defaultModel,
        defaultStyle: state.defaultStyle,
        sourceLanguage: state.sourceLanguage,
        targetLanguage: state.targetLanguage,
        selectedModel: state.selectedModel,
        selectedStyle: state.selectedStyle,
      }),
    }
  )
);
