'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Native-app style chrome for the customer experience on MOBILE only.
 * A slim top app bar + a fixed bottom tab bar. Hidden on md+ where the
 * regular marketing layout is used instead. Wrap a page's content with this.
 */
const TABS = [
  { href: '/deals', label: 'Deals', icon: Home },
  { href: '/account', label: 'My Claims', icon: Ticket },
  { href: '/account', label: 'Account', icon: User, match: '/account-profile' },
];

export function CustomerMobileChrome({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    // Only render this shell on mobile; desktop keeps the standard layout.
    <div className="md:hidden min-h-screen bg-background flex flex-col">
      {/* Top app bar */}
      <header className="sticky top-0 z-40 h-14 flex items-center justify-center border-b border-border bg-background/90 backdrop-blur-md px-4">
        <h1 className="text-base font-black tracking-tight">{title}</h1>
      </header>

      {/* Scrollable content; padded for the bottom tab bar */}
      <main className="flex-1 px-4 pt-5 pb-24">{children}</main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur-md flex items-stretch">
        {TABS.map((tab) => {
          const active = pathname === tab.href && !tab.match;
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
