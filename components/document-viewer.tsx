'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { TranslationChunk } from '@/lib/types';

type ViewMode = 'translated' | 'side-by-side' | 'original';

interface DocumentViewerProps {
  chunks: TranslationChunk[];
}

export function DocumentViewer({ chunks }: DocumentViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('translated');
  const [hoveredChunk, setHoveredChunk] = useState<number | null>(null);

  const tabs: { id: ViewMode; label: string }[] = [
    { id: 'translated', label: 'Translated' },
    { id: 'side-by-side', label: 'Side by Side' },
    { id: 'original', label: 'Original' },
  ];

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl inline-flex" style={{ background: 'var(--td-accent-subtle)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setViewMode(tab.id)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: viewMode === tab.id ? 'var(--td-surface)' : 'transparent',
              color: viewMode === tab.id ? 'var(--td-text-primary)' : 'var(--td-text-tertiary)',
              boxShadow: viewMode === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      >
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--td-border)' }}>
            <div className="p-6 space-y-4">
              <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--td-text-tertiary)' }}>
                Original
              </div>
              {chunks.map((chunk) => (
                <p key={chunk.index} className="text-sm leading-relaxed" style={{ color: 'var(--td-text-secondary)' }}>
                  {chunk.originalText}
                </p>
              ))}
            </div>
            <div className="p-6 space-y-4">
              <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--td-text-tertiary)' }}>
                Translation
              </div>
              {chunks.map((chunk) => (
                <p key={chunk.index} className="text-sm leading-relaxed" style={{ color: 'var(--td-text-primary)' }}>
                  {chunk.translatedText}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {chunks.map((chunk) => (
              <motion.div
                key={chunk.index}
                className="group relative"
                onMouseEnter={() => setHoveredChunk(chunk.index)}
                onMouseLeave={() => setHoveredChunk(null)}
              >
                <p className="text-sm leading-relaxed pr-8" style={{ color: 'var(--td-text-primary)' }}>
                  {viewMode === 'translated' ? chunk.translatedText : chunk.originalText}
                </p>
                <motion.button
                  type="button"
                  title="Re-translate this paragraph"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredChunk === chunk.index ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 top-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors duration-100"
                  style={{ color: 'var(--td-text-tertiary)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-text-primary)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--td-text-tertiary)'; }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
