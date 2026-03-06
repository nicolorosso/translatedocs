'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, GraduationCap, Files } from 'lucide-react';
import { DropZone } from '@/components/drop-zone';
import { ConfigPill } from '@/components/config-pill';
import { QuickActionCard } from '@/components/quick-action-card';
import { useStore } from '@/lib/store';
import { LANGUAGES, MODELS, STYLES } from '@/lib/mock-data';
import type { UploadedFile } from '@/lib/types';

const sourceLanguageOptions = LANGUAGES.map((l) => ({
  value: l.code,
  label: `${l.flag} ${l.name}`,
}));

const targetLanguageOptions = LANGUAGES.filter((l) => l.code !== 'auto').map((l) => ({
  value: l.code,
  label: `${l.flag} ${l.name}`,
}));

const modelOptions = MODELS.map((m) => ({
  value: m.id,
  label: m.name,
  description: `${m.quality} quality${m.costPer1k > 0 ? ` · $${m.costPer1k}/1k tokens` : ''}`,
}));

const styleOptions = STYLES.map((s) => ({
  value: s.id,
  label: s.name,
  description: s.description,
}));

export default function HomePage() {
  const router = useRouter();
  const {
    uploadedFiles,
    inputText,
    sourceLanguage,
    targetLanguage,
    selectedModel,
    selectedStyle,
    addUploadedFile,
    removeUploadedFile,
    setInputText,
    setSourceLanguage,
    setTargetLanguage,
    setSelectedModel,
    setSelectedStyle,
    setActiveJob,
  } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFilesAdded = (files: UploadedFile[]) => {
    files.forEach(addUploadedFile);
  };

  const canTranslate = uploadedFiles.length > 0 || inputText.trim().length > 0;

  const handleTranslate = async () => {
    if (!canTranslate || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: uploadedFiles[0]?.fileId,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          model: selectedModel,
          style: selectedStyle,
        }),
      });
      const data = await res.json();

      setActiveJob({
        jobId: data.jobId,
        fileId: uploadedFiles[0]?.fileId,
        fileName: uploadedFiles[0]?.fileName ?? 'Text Input',
        inputText: inputText || undefined,
        sourceLanguage,
        targetLanguage,
        model: selectedModel,
        style: selectedStyle,
        status: 'processing',
        completedChunks: 0,
        totalChunks: data.totalChunks,
        estimatedTime: data.estimatedTime,
        estimatedCost: data.estimatedCost,
        createdAt: new Date(),
        pageCount: uploadedFiles[0]?.pageCount,
        wordCount: uploadedFiles[0]?.wordCount,
      });

      router.push(`/translate/${data.jobId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (style: string, placeholder: string) => {
    setSelectedStyle(style as Parameters<typeof setSelectedStyle>[0]);
    setInputText(placeholder);
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.focus();
    }, 50);
  };

  const tgtLang = LANGUAGES.find((l) => l.code === targetLanguage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: 'var(--td-text-tertiary)' }}
          >
            AI-Powered Document Translation
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight leading-tight"
            style={{ color: 'var(--td-text-primary)' }}
          >
            What would you like to translate?
          </h1>
          <p className="text-sm" style={{ color: 'var(--td-text-secondary)' }}>
            Drop a document or describe what you need
          </p>
        </div>

        {/* Main input card */}
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{
            borderColor: isFocused ? 'var(--td-border-hover)' : 'var(--td-border)',
            background: 'var(--td-surface)',
            boxShadow: isFocused ? '0 4px 24px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
          }}
        >
          {/* Dropzone */}
          <DropZone
            files={uploadedFiles}
            onFilesAdded={handleFilesAdded}
            onFileRemoved={removeUploadedFile}
          />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--td-border)' }} />
            <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>or paste text</span>
            <div className="flex-1 h-px" style={{ background: 'var(--td-border)' }} />
          </div>

          {/* Text input */}
          <div
            className="relative rounded-xl border transition-all duration-150"
            style={{
              borderColor: isFocused ? 'var(--td-border-hover)' : 'var(--td-border)',
              background: 'var(--td-bg)',
            }}
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Or paste text to translate..."
              rows={3}
              className="w-full px-4 pt-3 pb-10 text-sm resize-none rounded-xl outline-none bg-transparent leading-relaxed"
              style={{ color: 'var(--td-text-primary)' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void handleTranslate();
                }
              }}
            />
            <button
              type="button"
              disabled={!canTranslate || isSubmitting}
              onClick={() => void handleTranslate()}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style={{
                background: canTranslate ? 'var(--td-accent)' : 'var(--td-border)',
                color: canTranslate ? 'var(--td-surface)' : 'var(--td-text-tertiary)',
                cursor: canTranslate ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={(e) => {
                if (canTranslate) (e.currentTarget as HTMLElement).style.background = 'var(--td-accent-hover)';
              }}
              onMouseLeave={(e) => {
                if (canTranslate) (e.currentTarget as HTMLElement).style.background = 'var(--td-accent)';
              }}
              title="Translate (⌘+Enter)"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Config pills */}
          <div className="flex flex-wrap items-center gap-2">
            <ConfigPill
              icon="🌐"
              label="Language"
              options={sourceLanguageOptions}
              value={sourceLanguage}
              onChange={setSourceLanguage}
            />
            <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>→</span>
            <ConfigPill
              icon={tgtLang?.flag ?? '🌐'}
              label="Target"
              options={targetLanguageOptions}
              value={targetLanguage}
              onChange={setTargetLanguage}
            />
            <div className="flex-1" />
            <ConfigPill
              icon="⚙️"
              label="Model"
              options={modelOptions}
              value={selectedModel}
              onChange={(v) => setSelectedModel(v as Parameters<typeof setSelectedModel>[0])}
            />
            <ConfigPill
              icon="📋"
              label="Style"
              options={styleOptions}
              value={selectedStyle}
              onChange={(v) => setSelectedStyle(v as Parameters<typeof setSelectedStyle>[0])}
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard
            icon={<FileText className="w-4 h-4" />}
            title="Translate a contract"
            description="Legal precision, formal tone"
            onClick={() => handleQuickAction('legal', 'Paste your contract text here to translate it with legal precision...')}
          />
          <QuickActionCard
            icon={<GraduationCap className="w-4 h-4" />}
            title="Research paper"
            description="Technical accuracy, citations"
            onClick={() => handleQuickAction('technical', 'Paste your research paper or abstract here...')}
          />
          <QuickActionCard
            icon={<Files className="w-4 h-4" />}
            title="Batch documents"
            description="Multiple files at once"
            onClick={() => handleQuickAction('general', '')}
          />
        </div>
      </div>
    </motion.div>
  );
}
