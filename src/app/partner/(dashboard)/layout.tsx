import React from 'react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';

const partnerMenuItems: SidebarItem[] = [
  { name: 'Dashboard', icon: 'dashboard', href: '/partner/dashboard' },
  { name: 'Analytics', icon: 'analytics', href: '/partner/analytics' },
  { name: 'Wallet', icon: 'wallet', href: '/partner/wallet' },
  { name: 'Production Keys', icon: 'keys', href: '/partner/keys' },
  { name: 'Sandbox Keys', icon: 'keys', href: '/partner/keys?env=sandbox' },
  { name: 'Sandbox Analytics', icon: 'analytics', href: '/partner/analytics?env=sandbox' },
  { name: 'API Playground', icon: 'zap', href: '/partner/playground' },
  { name: 'Documentation', icon: 'docs', href: '/partner/docs' },
  { name: 'Settings', icon: 'settings', href: '/partner/settings' },
  { name: 'Support', icon: 'support', href: '/partner/support' },
];

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={partnerMenuItems} role="partner" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
            <p className="text-muted-foreground">Monitor API usage and integrate Deals-as-a-Service.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              Partner Tier: Pro
            </div>
            <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center font-bold text-primary">
              P
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
