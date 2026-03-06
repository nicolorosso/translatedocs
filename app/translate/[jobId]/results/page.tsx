'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, Copy, Share2, CheckCircle } from 'lucide-react';
import { DocumentViewer } from '@/components/document-viewer';
import { useStore } from '@/lib/store';
import { getLanguage, getModelName } from '@/lib/mock-data';
import type { TranslationResult } from '@/lib/types';

export default function ResultsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { activeJob } = useStore();

  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/translate/${jobId}/result`)
      .then((r) => r.json())
      .then((data: TranslationResult) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  const handleCopy = () => {
    if (!result) return;
    const text = result.chunks.map((c) => c.translatedText).join('\n\n');
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = result.chunks.map((c) => c.translatedText).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeJob?.fileName?.replace(/\.[^.]+$/, '') ?? 'translation'}_translated.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const srcLang = getLanguage(activeJob?.sourceLanguage ?? 'auto');
  const tgtLang = getLanguage(activeJob?.targetLanguage ?? 'en');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        {/* Skeleton */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl animate-pulse"
            style={{ background: 'var(--td-accent-subtle)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--td-success)' }} />
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--td-text-primary)' }}>
            Translation Complete
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--td-text-secondary)' }}>
          {srcLang.flag} {srcLang.name} → {tgtLang.flag} {tgtLang.name}
          {activeJob?.fileName ? ` · ${activeJob.fileName}` : ''}
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.02]"
          style={{ background: 'var(--td-accent)', color: 'var(--td-surface)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent)'; }}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150"
          style={{ borderColor: 'var(--td-border)', color: 'var(--td-text-secondary)', background: 'var(--td-surface)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--td-border-hover)';
            el.style.color = 'var(--td-text-primary)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--td-border)';
            el.style.color = 'var(--td-text-secondary)';
          }}
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy All'}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150"
          style={{ borderColor: 'var(--td-border)', color: 'var(--td-text-secondary)', background: 'var(--td-surface)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--td-border-hover)';
            el.style.color = 'var(--td-text-primary)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--td-border)';
            el.style.color = 'var(--td-text-secondary)';
          }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Document viewer */}
      {result && <DocumentViewer chunks={result.chunks} />}

      {/* Metadata footer */}
      {result && (
        <div
          className="flex items-center gap-6 px-5 py-4 rounded-xl border text-xs"
          style={{ borderColor: 'var(--td-border)', color: 'var(--td-text-tertiary)', background: 'var(--td-surface)' }}
        >
          <div>
            <span className="font-medium" style={{ color: 'var(--td-text-secondary)' }}>{result.wordCount.toLocaleString()}</span>
            {' '}words
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--td-text-secondary)' }}>{result.processingTime}s</span>
            {' '}processing time
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--td-text-secondary)' }}>{getModelName(result.model)}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: 'var(--td-text-secondary)' }}>${result.cost.toFixed(3)}</span>
            {' '}cost
          </div>
        </div>
      )}
    </motion.div>
  );
}
