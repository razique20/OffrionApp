import React from 'react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';

const adminMenuItems: SidebarItem[] = [
  { name: 'Governance', icon: 'analytics', href: '/admin/dashboard' },
  { name: 'Support', icon: 'support', href: '/admin/support' },
  { name: 'System Settings', icon: 'settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={adminMenuItems} role="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
            <p className="text-muted-foreground">Manage users, categories, and platform-wide settings.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-premium-gradient shadow-lg shadow-primary/20 text-white px-4 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Super Admin
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
