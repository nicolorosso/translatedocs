'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TranslationCard } from '@/components/translation-card';
import { useStore } from '@/lib/store';

export default function HistoryPage() {
  const { history } = useStore();
  const [query, setQuery] = useState('');

  const filtered = history.filter((item) =>
    item.fileName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--td-text-primary)' }}>
            Translation History
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--td-text-secondary)' }}>
            {history.length} translation{history.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-[1.02]"
          style={{ background: 'var(--td-accent)', color: 'var(--td-surface)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--td-accent)'; }}
        >
          New translation
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150"
        style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--td-text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search translations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--td-text-primary)' }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-4xl">📄</div>
          <div className="font-medium" style={{ color: 'var(--td-text-secondary)' }}>
            {query ? 'No matching translations' : 'No translations yet'}
          </div>
          <Link
            href="/"
            className="text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--td-text-secondary)' }}
          >
            Start your first one →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div
              key={item.jobId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TranslationCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
