'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@white/ui';

export interface StatCard {
  label: string;
  value: number | undefined;
  href: string;
  /** Pre-rendered JSX (e.g. `<CalendarCheck className="h-5 w-5" />`) — a raw component
   * reference can't cross the Server→Client boundary, but an already-rendered element can. */
  icon: React.ReactNode;
  iconClass: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function StatCardsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
        >
          <Link href={stat.href}>
            <Card className="transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(142,75,92,0.25)]">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-charcoal-500">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-charcoal-900">{stat.value ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
