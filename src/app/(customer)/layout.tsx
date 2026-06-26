'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileChromeProvider, useMobileChrome } from '@/components/customer/MobileChromeContext';

const TABS = [
  { href: '/deals', label: 'Deals', icon: Home, isActive: (p: string) => p.startsWith('/deals') },
  { href: '/account', label: 'My Account', icon: Ticket, isActive: (p: string) => p.startsWith('/account') },
];

/**
 * Persistent mobile shell for the customer app. Lives in the (customer) layout
 * so the top bar + bottom tabs DO NOT remount when navigating between /deals and
 * /account — only the page content swaps. The chrome elements are mobile-only
 * (md:hidden) and fixed-positioned, so they overlay the single children tree
 * without duplicating it; desktop sees only the page's own layout.
 */
function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { title, back, bottomBar, showShell: showShellRaw } = useMobileChrome();
  const showShell = showShellRaw !== false;

  return (
    <div className="min-h-screen bg-background">
      {/* Top app bar (mobile only) */}
      {showShell && (
        <header className="md:hidden sticky top-0 z-40 h-14 flex items-center border-b border-border bg-background/90 backdrop-blur-md px-4">
          {back ? (
            <button onClick={() => router.back()} className="flex items-center" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}
          <h1 className={cn('text-base font-black tracking-tight truncate', back ? 'mx-auto pr-8' : 'mx-auto')}>{title}</h1>
        </header>
      )}

      {children}

      {/* Sticky action bar (mobile only) */}
      {showShell && bottomBar && (
        <div className="md:hidden fixed bottom-16 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3">
          {bottomBar}
        </div>
      )}

      {/* Bottom tab bar (mobile only) */}
      {showShell && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur-md flex items-stretch">
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
      )}
    </div>
  );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileChromeProvider>
      <MobileShell>{children}</MobileShell>
    </MobileChromeProvider>
  );
}
