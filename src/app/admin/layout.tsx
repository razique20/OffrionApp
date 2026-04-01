import React from 'react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';

const adminMenuItems: SidebarItem[] = [
  { name: 'Overview', icon: 'analytics', href: '/admin/dashboard' },
  { name: 'Categories', icon: 'dashboard', href: '/admin/categories' },
  { name: 'Users', icon: 'users', href: '/admin/users' },
  { name: 'System Logs', icon: 'docs', href: '/admin/logs' },
  { name: 'Security', icon: 'security', href: '/admin/security' },
  { name: 'Settings', icon: 'settings', href: '/admin/settings' },
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
            <div className="bg-destructive/5 border border-destructive/20 text-destructive px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span>
              Admin Level 1
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
