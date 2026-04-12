import { cn } from '@/lib/utils';
import Sidebar, { SidebarItem } from '@/components/Sidebar';
import Link from 'next/link';
import { Zap, BookOpen } from 'lucide-react';

const partnerMenuItems: SidebarItem[] = [
  { name: 'Dashboard', icon: 'dashboard', href: '/partner/dashboard' },
  { name: 'Analytics', icon: 'analytics', href: '/partner/analytics' },
  { name: 'Financials', icon: 'wallet', href: '/partner/wallet' },
  { name: 'Transactions', icon: 'dashboard', href: '/partner/transactions' },
  { name: 'API Keys', icon: 'keys', href: '/partner/api-keys' },
  { name: 'Webhooks', icon: 'notifications', href: '/partner/webhooks' },
  { name: 'Settings', icon: 'settings', href: '/partner/settings' },
  { name: 'Support', icon: 'support', href: '/partner/support' },
];

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar items={partnerMenuItems} role="partner" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-8 md:pt-0 pr-12 md:pr-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
            <p className="text-muted-foreground">Monitor API usage and integrate Deals-as-a-Service.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/partner/docs"
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border text-muted-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </Link>
            <div className="h-4 w-px bg-border mx-2" />
            <div className="bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
              Partner Tier: Pro
            </div>
            <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center font-bold text-primary shadow-sm hover:shadow-md transition-all cursor-pointer">
              P
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
