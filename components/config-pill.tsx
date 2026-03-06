'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfigPillOption {
  value: string;
  label: string;
  description?: string;
}

interface ConfigPillProps {
  icon: string;
  label: string;
  options: ConfigPillOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ConfigPill({ icon, label, options, value, onChange }: ConfigPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-150 cursor-pointer"
        style={{
          borderColor: open ? 'var(--td-border-hover)' : 'var(--td-border)',
          color: open ? 'var(--td-text-primary)' : 'var(--td-text-secondary)',
          background: open ? 'var(--td-accent-subtle)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--td-border-hover)';
          el.style.color = 'var(--td-text-primary)';
        }}
        onMouseLeave={(e) => {
          if (!open) {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--td-border)';
            el.style.color = 'var(--td-text-secondary)';
          }
        }}
      >
        <span>{icon}</span>
        <span>{selected?.label ?? label}</span>
        <ChevronDown
          className="w-3 h-3 transition-transform duration-150"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 z-50 min-w-[180px] rounded-xl border shadow-lg overflow-hidden"
            style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-left px-3 py-2.5 transition-colors duration-100 flex flex-col gap-0.5"
                style={{
                  background: opt.value === value ? 'var(--td-accent-subtle)' : 'transparent',
                  color: opt.value === value ? 'var(--td-text-primary)' : 'var(--td-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--td-surface-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--td-text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = opt.value === value ? 'var(--td-accent-subtle)' : 'transparent';
                  (e.currentTarget as HTMLElement).style.color = opt.value === value ? 'var(--td-text-primary)' : 'var(--td-text-secondary)';
                }}
              >
                <span className="text-xs font-medium">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs" style={{ color: 'var(--td-text-tertiary)' }}>{opt.description}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
