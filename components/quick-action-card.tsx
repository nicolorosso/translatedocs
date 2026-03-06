'use client';

import type { ReactNode } from 'react';

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm"
      style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--td-border-hover)';
        el.style.background = 'var(--td-surface)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--td-border)';
        el.style.background = 'var(--td-surface)';
      }}
    >
      <div
        className="mb-3 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 group-hover:text-[var(--td-text-primary)]"
        style={{ color: 'var(--td-text-tertiary)', background: 'var(--td-accent-subtle)' }}
      >
        {icon}
      </div>
      <div className="font-medium text-sm" style={{ color: 'var(--td-text-primary)' }}>
        {title}
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--td-text-tertiary)' }}>
        {description}
      </div>
    </button>
  );
}
