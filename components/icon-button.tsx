'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  className?: string;
}

export function IconButton({ icon, tooltip, onClick, href, active, className }: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowTooltip(true), 300);
  };
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const baseClass = `relative inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
    active
      ? 'bg-[var(--td-accent-subtle)] text-[var(--td-text-primary)]'
      : 'text-[var(--td-text-tertiary)] hover:text-[var(--td-text-primary)] hover:bg-[var(--td-surface-hover)]'
  } ${className ?? ''}`;

  const content = (
    <>
      {icon}
      {showTooltip && (
        <span
          className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs pointer-events-none z-50 shadow-sm"
          style={{
            background: 'var(--td-text-primary)',
            color: 'var(--td-surface)',
          }}
        >
          {tooltip}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClass}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
}
