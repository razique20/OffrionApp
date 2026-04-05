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

  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setMe(data))
      .catch(console.error);
  }, []);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const actualLogout = async () => {
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

  const isSuperAdmin = me?.role === 'super_admin';

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col sticky top-0 overflow-y-auto custom-scrollbar z-50">
      <div className="p-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="flex-1 space-y-6">
        <nav className="px-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-50">Local Scope</p>
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
                    ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {isSuperAdmin && (
          <nav className="px-4 space-y-1">
             <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Universal Gateway</p>
             <Link 
              href="/admin/dashboard" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname.startsWith('/admin') ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "text-muted-foreground hover:bg-secondary"
              )}>
                <ShieldCheck className="w-5 h-5" />
                <span>Admin Governance</span>
             </Link>
             <Link 
              href="/merchant/dashboard" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname.startsWith('/merchant') ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "text-muted-foreground hover:bg-secondary"
              )}>
                <ShoppingBag className="w-5 h-5" />
                <span>Merchant Portal</span>
             </Link>
             <Link 
              href="/partner/dashboard" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname.startsWith('/partner') ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "text-muted-foreground hover:bg-secondary"
              )}>
                <Handshake className="w-5 h-5" />
                <span>Partner Hub</span>
             </Link>
          </nav>
        )}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
           <div>
             <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold leading-none mb-1">Session Role</p>
             <p className="text-xs font-bold capitalize leading-none">{role}</p>
           </div>
           {isSuperAdmin && <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 animate-pulse" />}
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsLogoutConfirmOpen(false)} />
          <div className="bg-card w-full max-w-sm border border-border rounded-[40px] shadow-2xl relative z-[10000] overflow-hidden p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
              <LogOut className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">End Session?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-4">
                Are you sure you want to log out of the Offrion governance ecosystem?
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)} 
                className="flex-1 py-3 text-xs font-bold bg-secondary rounded-xl hover:bg-secondary/80 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={actualLogout} 
                className="flex-1 py-3 text-xs font-bold bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
