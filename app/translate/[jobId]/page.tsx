'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';
import { ProgressBar } from '@/components/progress-bar';
import { useStore } from '@/lib/store';
import { getLanguage, getModelName } from '@/lib/mock-data';

interface StatusResponse {
  jobId: string;
  status: 'processing' | 'completed';
  completedChunks: number;
  totalChunks: number;
  currentChunkPreview: string | null;
  estimatedSecondsRemaining: number;
}

export default function TranslatePage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const router = useRouter();
  const { activeJob, updateActiveJob, addToHistory } = useStore();

  const [previews, setPreviews] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/translate/${jobId}/status`);
        const data: StatusResponse = await res.json();

        updateActiveJob({
          completedChunks: data.completedChunks,
          totalChunks: data.totalChunks,
          status: data.status === 'completed' ? 'completed' : 'processing',
        });

        if (data.currentChunkPreview) {
          setPreviews((prev) => {
            if (prev[prev.length - 1] === data.currentChunkPreview) return prev;
            return [...prev, data.currentChunkPreview!];
          });
        }

        if (data.status === 'completed') {
          setIsDone(true);
          if (intervalRef.current) clearInterval(intervalRef.current);

          if (activeJob) {
            addToHistory({
              jobId,
              fileName: activeJob.fileName ?? 'Translation',
              date: new Date(),
              sourceLang: activeJob.sourceLanguage,
              targetLang: activeJob.targetLanguage,
              model: activeJob.model,
              pages: activeJob.pageCount ?? data.totalChunks,
              status: 'completed',
              cost: activeJob.estimatedCost ?? 0.10,
            });
          }

          setTimeout(() => {
            router.push(`/translate/${jobId}/results`);
          }, 1500);
        }
      } catch (e) {
        console.error('Status poll error:', e);
      }
    };

    void poll();
    intervalRef.current = setInterval(() => void poll(), 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    previewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previews]);

  const completed = activeJob?.completedChunks ?? 0;
  const total = activeJob?.totalChunks ?? 1;
  const srcLang = getLanguage(activeJob?.sourceLanguage ?? 'auto');
  const tgtLang = getLanguage(activeJob?.targetLanguage ?? 'en');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      {/* File info header */}
      <div
        className="rounded-xl border p-5 flex items-center gap-4"
        style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--td-accent-subtle)' }}
        >
          <FileText className="w-5 h-5" style={{ color: 'var(--td-text-secondary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate" style={{ color: 'var(--td-text-primary)' }}>
            {activeJob?.fileName ?? 'Translation Job'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--td-text-tertiary)' }}>
            {srcLang.flag} {srcLang.name} → {tgtLang.flag} {tgtLang.name}
            {activeJob?.pageCount ? ` · ${activeJob.pageCount} pages` : ''}
            {' · '}{getModelName(activeJob?.model ?? 'claude-sonnet')}
          </div>
        </div>
        {activeJob?.estimatedCost && (
          <div className="text-xs shrink-0" style={{ color: 'var(--td-text-tertiary)' }}>
            ~${activeJob.estimatedCost.toFixed(3)}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-6">
        <ProgressBar completed={completed} total={total} />

        {/* Estimated time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--td-text-tertiary)' }} />
          <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>
            {isDone
              ? 'Translation complete — redirecting...'
              : completed === 0
              ? 'Starting translation...'
              : `About ${Math.ceil(((total - completed) / Math.max(completed, 1)) * 2)} seconds remaining`}
          </span>
        </div>
      </div>

      {/* Live preview */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--td-text-tertiary)' }}>
            Live Preview
          </div>
          <div
            className="rounded-xl border overflow-hidden max-h-72 overflow-y-auto"
            style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
          >
            <div className="p-5 space-y-4">
              <AnimatePresence>
                {previews.map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i === previews.length - 1 ? 0 : 0 }}
                    className="text-sm leading-relaxed"
                    style={{
                      color: i === previews.length - 1 ? 'var(--td-text-primary)' : 'var(--td-text-secondary)',
                    }}
                  >
                    {text}
                  </motion.p>
                ))}
              </AnimatePresence>
              <div ref={previewEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Done state */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ background: '#dcfce7', color: 'var(--td-success)' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--td-success)' }} />
            Translation complete
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
