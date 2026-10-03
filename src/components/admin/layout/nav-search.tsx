'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@white/ui';
import { NAV_SECTIONS } from './nav-config';
import type { Session } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';

export function NavSearch({ session }: { session: Session }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      NAV_SECTIONS.flatMap((section) =>
        section.items
          .filter((item) => hasPermission(session, item.permission))
          .map((item) => ({ ...item, section: section.label })),
      ),
    [session],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function go(href: string) {
    router.push(href);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) go(results[0].href);
        }}
        placeholder="Search…"
        className="h-9 w-full rounded-full border border-ivory-200 bg-ivory-50 pl-9 pr-14 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-peach-400 focus:outline-none focus:ring-2 focus:ring-peach-400/30"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-ivory-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-charcoal-400">
        ⌘K
      </kbd>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-ivory-200 bg-white py-1.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)]">
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-charcoal-700 hover:bg-ivory-100',
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-charcoal-400" />
                <span className="flex-1 truncate">{item.label}</span>
                <span className="text-[11px] text-charcoal-300">{item.section}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
