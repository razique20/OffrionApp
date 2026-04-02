'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronRight,
  LogOut,
  BarChart3,
  LayoutDashboard,
  Tag,
  Key,
  BookOpen,
  Settings,
  LifeBuoy,
  Users,
  ShieldCheck,
  TrendingUp,
  Globe,
  Zap,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

export const iconMap = {
  dashboard: LayoutDashboard,
  deals: Tag,
  analytics: BarChart3,
  keys: Key,
  docs: BookOpen,
  settings: Settings,
  support: LifeBuoy,
  merchants: ShoppingBag,
  partners: Handshake,
  users: Users,
  security: ShieldCheck,
  trending: TrendingUp,
  globe: Globe,
  zap: Zap,
  notifications: Bell
};

import { Handshake } from 'lucide-react';

export type IconName = keyof typeof iconMap;

export interface SidebarItem {
  name: string;
  icon: IconName;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  role?: 'merchant' | 'partner' | 'admin';
}

export default function Sidebar({ items, role = 'merchant' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Find the most specific (longest) matching item for the current path
  const matchingItems = items
    .filter(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length);
  
  const activeItemHref = matchingItems[0]?.href;

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return (
      <div className="w-64 bg-card border-r border-border h-screen flex flex-col sticky top-0">
        <div className="p-6">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <div key={item.name} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
              </div>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => {
          const isActive = activeItemHref === item.href;
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 truncate">{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-4 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
           <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Active Role</p>
           <p className="text-xs font-bold capitalize">{role}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
