import React from 'react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';

const merchantMenuItems: SidebarItem[] = [
  { name: 'Dashboard', icon: 'dashboard', href: '/merchant/dashboard' },
  { name: 'My Deals', icon: 'deals', href: '/merchant/deals' },
  { name: 'Create Deal', icon: 'zap', href: '/merchant/deals/new' },
  { name: 'Analytics', icon: 'analytics', href: '/merchant/analytics' },
  { name: 'Settings', icon: 'settings', href: '/merchant/settings' },
];

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={merchantMenuItems} role="merchant" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Merchant Dashboard</h1>
            <p className="text-muted-foreground">Manage your deals and track performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center font-bold text-primary">
              M
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
