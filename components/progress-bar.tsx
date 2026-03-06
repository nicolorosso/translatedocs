'use client';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export function ProgressBar({ completed, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--td-text-secondary)' }}>
          {label ?? `Translating... ${completed} of ${total} pages`}
        </span>
        <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--td-text-primary)' }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--td-accent-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: 'var(--td-progress)' }}
        />
      </div>
    </div>
  );
}
