'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Native-app style chrome for the customer experience on MOBILE only.
 * A slim top app bar + a fixed bottom tab bar. Hidden on md+ where the
 * regular marketing layout is used instead. Wrap a page's content with this.
 */
const TABS = [
  { href: '/deals', label: 'Deals', icon: Home, isActive: (p: string) => p.startsWith('/deals') },
  { href: '/account', label: 'My Account', icon: Ticket, isActive: (p: string) => p.startsWith('/account') },
];

export function CustomerMobileChrome({
  title,
  back = false,
  bottomBar,
  children,
}: {
  title: string;
  /** Show a back arrow instead of a centered title (e.g. deal detail). */
  back?: boolean;
  /** Optional sticky action bar pinned above the tab bar (e.g. a claim button). */
  bottomBar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    // Only render this shell on mobile; desktop keeps the standard layout.
    <div className="md:hidden min-h-screen bg-background flex flex-col">
      {/* Top app bar */}
      <header className="sticky top-0 z-40 h-14 flex items-center border-b border-border bg-background/90 backdrop-blur-md px-4">
        {back ? (
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-bold" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}
        <h1 className={cn('text-base font-black tracking-tight', back ? 'mx-auto pr-8 truncate' : 'mx-auto')}>{title}</h1>
      </header>

      {/* Scrollable content; padded for the bottom tab bar (+ action bar if any) */}
      <main className={cn('flex-1 px-4 pt-5', bottomBar ? 'pb-40' : 'pb-24')}>{children}</main>

      {/* Optional sticky action bar (sits above the tab bar) */}
      {bottomBar && (
        <div className="fixed bottom-16 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3">
          {bottomBar}
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur-md flex items-stretch">
        {TABS.map((tab) => {
          const active = tab.isActive(pathname || '');
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('w-5 h-5', active && 'text-primary')} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
