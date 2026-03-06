'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Settings } from 'lucide-react';
import { IconButton } from './icon-button';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b flex items-center px-6"
      style={{ borderColor: 'var(--td-border)', background: 'var(--td-surface)' }}>
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link href="/" className="font-semibold text-base transition-opacity hover:opacity-70"
          style={{ color: 'var(--td-text-primary)' }}>
          TranslateDocs
        </Link>

        <nav className="flex items-center gap-1">
          <IconButton
            href="/history"
            icon={<Clock className="w-4 h-4" />}
            tooltip="Translation History"
            active={pathname === '/history'}
          />
          <IconButton
            href="/settings"
            icon={<Settings className="w-4 h-4" />}
            tooltip="Settings"
            active={pathname === '/settings'}
          />
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center ml-2 text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--td-accent)', color: 'var(--td-surface)' }}
            title="Account"
          >
            U
          </div>
        </nav>
      </div>
    </header>
  );
}
