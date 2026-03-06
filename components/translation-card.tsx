'use client';

import Link from 'next/link';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { HistoryItem } from '@/lib/types';
import { getLanguage, getModelName } from '@/lib/mock-data';

interface TranslationCardProps {
  item: HistoryItem;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'var(--td-success)', label: 'Completed' },
  error: { icon: AlertCircle, color: 'var(--td-error)', label: 'Error' },
  processing: { icon: Clock, color: 'var(--td-text-tertiary)', label: 'Processing' },
  uploading: { icon: Clock, color: 'var(--td-text-tertiary)', label: 'Uploading' },
  idle: { icon: Clock, color: 'var(--td-text-tertiary)', label: 'Idle' },
};

export function TranslationCard({ item }: TranslationCardProps) {
  const src = getLanguage(item.sourceLang);
  const tgt = getLanguage(item.targetLang);
  const status = statusConfig[item.status] ?? statusConfig.idle;
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/translate/${item.jobId}/results`}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-150 group cursor-pointer"
      style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--td-border-hover)';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--td-border)';
        el.style.boxShadow = 'none';
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate" style={{ color: 'var(--td-text-primary)' }}>
          {item.fileName}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--td-text-tertiary)' }}>
          {src.flag} {src.name} → {tgt.flag} {tgt.name} · {item.pages} pages · {getModelName(item.model)}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>
          ${item.cost.toFixed(2)}
        </span>
        <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>
          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <div className="flex items-center gap-1">
          <StatusIcon className="w-3.5 h-3.5" style={{ color: status.color }} />
          <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>{status.label}</span>
        </div>
      </div>
    </Link>
  );
}
